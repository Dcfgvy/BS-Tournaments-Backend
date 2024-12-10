import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Purchase } from 'src/database/entities/payments/Purchase.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>
  ) {}

  async fetchAllPurchases(
    paginationOptions: IPaginationOptions,
    userId?: number,
    createdFrom?: Date,
    createdTo?: Date,
  ): Promise<Pagination<Purchase>> {
    let query = this.purchaseRepository
      .createQueryBuilder('purchases')
      .leftJoinAndSelect('purchases.user', 'user');
  
    // Filter by user ID
    if(userId){
      query = query.andWhere('purchases.userId = :userId', { userId });
    }
  
    // Filter by creation date range
    if(createdFrom){
      query = query.andWhere('purchases.createdAt >= :createdFrom', { createdFrom });
    }
  
    if(createdTo){
      query = query.andWhere('purchases.createdAt <= :createdTo', { createdTo });
    }
  
    query = query.orderBy('purchases.createdAt', 'DESC');
  
    return paginate<Purchase>(query, paginationOptions);
  }
}
