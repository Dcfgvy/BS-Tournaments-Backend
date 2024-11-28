import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Withdrawal } from 'src/database/entities/payments/Withdrawal.entity';
import { WithdrawalMethod } from 'src/database/entities/payments/WithdrawalMethod.entity';
import { CryptoBotService } from '../crypto-bot/crypto-bot.service';
import { Repository } from 'typeorm';
import { IPaymentService } from 'src/payments/interfaces/payment-service.interface';
import { User } from 'src/database/entities/User.entity';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { validateWithdrawalPayload } from 'src/payments/utils/validate-payload.util';
import { CreateWithdrawalMethodDto } from 'src/payments/dtos/CreateWithdrawalMethod.dto';
import { UpdateWithdrawalMethodDto } from 'src/payments/dtos/UpdateWithdrawalMethod.dto';

@Injectable()
export class WithdrawalsService {
  private readonly services = new Map<string, IPaymentService>();

  constructor(
    private readonly cryptoBotService: CryptoBotService,
    @InjectRepository(WithdrawalMethod)
    private readonly withdrawalMethodRepository: Repository<WithdrawalMethod>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
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

    await validateWithdrawalPayload(methodName, data);

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

    const paymentService: IPaymentService = this.getPaymentService(methodName);
    return paymentService.withdraw(withdrawal, data);
  }

  getAllWithdrawalMethods(){
    return this.withdrawalMethodRepository.find();
  }

  getActiveWithdrawalMethods(){
    return this.withdrawalMethodRepository.findBy({ isActive: true });
  }

  createWithdrawalMethod(data: CreateWithdrawalMethodDto){
    return this.withdrawalMethodRepository.save({
      ...data,
      names: JSON.stringify(data.names),
      descriptions: JSON.stringify(data.descriptions),
      comission: parseFloat(data.comission),
    });
  }

  updateWithdrawalMethod(methodId: number, data: UpdateWithdrawalMethodDto){
    let payload: any = {
      id: methodId,
      ...data
    };
    if(data.names)
      payload.names = JSON.stringify(data.names);
    if(data.descriptions)
      payload.descriptions = JSON.stringify(data.descriptions);
    return this.withdrawalMethodRepository.save(payload);
  } 

  deleteWithdrawalMethod(methodId: number) {
    return this.withdrawalMethodRepository.delete({ id: methodId });
  }
}
