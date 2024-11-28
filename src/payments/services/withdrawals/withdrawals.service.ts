import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { WithdrawalMethod } from 'src/database/entities/payments/WithdrawalMethod.entity';
import { CryptoBotService } from '../crypto-bot/crypto-bot.service';
import { Connection, Repository } from 'typeorm';
import { IPaymentService } from 'src/payments/interfaces/payment-service.interface';
import { User } from 'src/database/entities/User.entity';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { validatePayload } from 'src/payments/utils/validate-withdrawal-payload.util';
import { WithdrawalMethodCreateDto } from 'src/payments/dtos/WithdrawalMethodCreate.dto';

@Injectable()
export class WithdrawalsService {
  private readonly services = new Map<string, IPaymentService>();

  constructor(
    private readonly cryptoBotService: CryptoBotService,
    @InjectRepository(WithdrawalMethod)
    private readonly withdrawalMethodRepository: Repository<WithdrawalMethod>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    private readonly dbConnection: Connection,
  ) {
    this.services.set('crypto-bot', this.cryptoBotService);
  }

  private getPaymentService(methodName: string): IPaymentService {
    const service = this.services.get(methodName);
    if(!service) throw new HttpException('Unsupported withdrawal method', HttpStatus.NOT_IMPLEMENTED);
    return service;
  }

  async makeWithdrawal(
    methodName: string,
    user: User,
    data: any
  ){
    const method = await this.withdrawalMethodRepository.findOneBy({ methodName, isActive: true });
    if(!method) throw new HttpException('Withdrawal method not found', HttpStatus.NOT_FOUND);

    await validatePayload(methodName, data);

    // Check the amount
    if(user.balance < data.amount) throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    if(data.amount < method.minAmount || data.amount > method.maxAmount) {
      throw new HttpException('Amount does not meet withdrawal limits', HttpStatus.BAD_REQUEST);
    }

    // Process the withdrawal
    const withdrawal = this.withdrawalRepository.create({
      amount: data.amount,
      user: user,
      method: method,
      status: WithdrawalStatus.PENDING,
    });
    await this.withdrawalRepository.save(withdrawal);

    const queryRunner = this.dbConnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try{
      const paymentService: IPaymentService = this.getPaymentService(methodName);
      const result = await paymentService.withdraw(withdrawal, data);

      const lockedUser = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
        lock: { mode: 'pessimistic_write' },
      });
      if(!lockedUser) throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR);

      lockedUser.balance -= withdrawal.amount;
      withdrawal.status = WithdrawalStatus.SUCCESS;

      await queryRunner.manager.save(lockedUser);
      await queryRunner.manager.save(withdrawal);
      await queryRunner.commitTransaction();

      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await this.withdrawalRepository.save({ ...withdrawal, status: WithdrawalStatus.CANCELLED });
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createWithdrawalMethod(data: WithdrawalMethodCreateDto){
    return this.withdrawalMethodRepository.save({
      ...data,
      names: JSON.stringify(data.names),
      descriptions: JSON.stringify(data.descriptions),
      comission: parseFloat(data.comission),
    });
  }
}
