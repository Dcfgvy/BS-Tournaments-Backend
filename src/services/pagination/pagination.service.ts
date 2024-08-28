import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    pageNumber: number,
    pageSize: number,
    query: object = {},
  ): Promise<{ items: T[]; totalCount: number }> {
    const [items, totalCount] = await repository.findAndCount({
      where: query,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      totalCount,
    };
  }

  async paginateRawRequest<T>(
    pageNumber: number,
    pageSize: number,
    rawQuery: SelectQueryBuilder<T>,
  ): Promise<{ items: T[]; totalCount: number }> {
    const totalCount = await rawQuery.getCount();
    const items = await rawQuery.skip((pageNumber - 1) * pageSize).take(pageSize).getMany();

    return {
      items,
      totalCount,
    };
  }
}
