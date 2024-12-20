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
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Tournament } from 'src/database/entities/Tournament.entity';
import { TournamentStatus } from 'src/tournaments/enums/tournament-status.enum';

@Injectable()
export class WithdrawalsService {
  private readonly services = new Map<string, IPaymentService>();

  constructor(
    private readonly cryptoBotService: CryptoBotService,
    @InjectRepository(WithdrawalMethod)
    private readonly withdrawalMethodRepository: Repository<WithdrawalMethod>,
    @InjectRepository(Withdrawal)
    private readonly withdrawalRepository: Repository<Withdrawal>,
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async fetchWithdrawals(
    paginationOptions: IPaginationOptions,
    userId?: number,
    methodName?: string,
    createdFrom?: Date,
    createdTo?: Date,
  ): Promise<Pagination<Withdrawal>> {
    let query = this.withdrawalRepository
      .createQueryBuilder('withdrawals')
      .leftJoinAndSelect('withdrawals.user', 'user')
      .leftJoinAndSelect('withdrawals.method', 'method');
  
    if(methodName) query = query.andWhere('method.methodName = :methodName', { methodName });
    if(userId) query = query.andWhere('user.id = :userId', { userId });
  
    // Filter by creation date range
    if(createdFrom) query = query.andWhere('withdrawals.createdAt >= :createdFrom', { createdFrom });
    if(createdTo) query = query.andWhere('withdrawals.createdAt <= :createdTo', { createdTo });
  
    query = query.orderBy('withdrawals.createdAt', 'DESC');
  
    return paginate<Withdrawal>(query, paginationOptions);
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
      serviceComission: parseFloat(data.serviceComission),
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
    if(data.comission)
      payload.comission = parseFloat(data.comission);
    if(data.serviceComission)
      payload.serviceComission = parseFloat(data.serviceComission);
    return this.withdrawalMethodRepository.save(payload);
  } 

  deleteWithdrawalMethod(methodId: number) {
    return this.withdrawalMethodRepository.delete({ id: methodId });
  }

  async calculateTotalBalanceAndFrozenMoney(): Promise<number> {
    // 1. Calculate the sum of all non-banned users' balances
    const nonBannedUsersBalanceResult = await this.userRepository
      .createQueryBuilder('user')
      .select('SUM(user.balance)', 'sum')
      .where('user.isBanned = :isBanned', { isBanned: false })
      .getRawOne();
    const nonBannedUsersBalance = parseFloat(nonBannedUsersBalanceResult.sum || 0);

    const frozenMoneyResult = await this.tournamentRepository
      .createQueryBuilder('tournament')
      .leftJoin('tournament.contestants', 'contestant')
      .select('tournament.id', 'tournamentId')
      .addSelect('tournament.entryCost', 'entryCost')
      .addSelect('COUNT(contestant.id)', 'contestantCount')
      .where('tournament.status IN (:...statuses)', {
        statuses: [
          TournamentStatus.RECRUITMENT,
          TournamentStatus.WAITING_FOR_START,
          TournamentStatus.STARTED,
          TournamentStatus.FROZEN,
        ],
      })
      .groupBy('tournament.id')
      .addGroupBy('tournament.entryCost')
      .getRawMany();
    
    // Calculate frozen money
    const frozenMoney = frozenMoneyResult.reduce((total, row) => {
      const contestantCount = parseFloat(row.contestantCount || '0') - 1; // Subtract 1 from the contestant count
      const entryCost = parseFloat(row.entryCost || '0');
      return total + entryCost * contestantCount;
    }, 0);

    return nonBannedUsersBalance + frozenMoney;
  }

  async getMinimalBalanceForWithdrawalMethod(methodId: number): Promise<number> {
    const allMonetToPayOut = await this.calculateTotalBalanceAndFrozenMoney();
    const method = await this.withdrawalMethodRepository.findOneBy({ id: methodId });
    const minBalance = allMonetToPayOut * (1 - method.comission) / (1 - method.serviceComission);
    return minBalance;
  }
}
