import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PaginationParamsDto } from './pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T>(
    repository: Repository<T>,
    { page, limit }: PaginationParamsDto,
    where: object = {},
  ): Promise<{ items: T[]; totalCount: number }> {
    const [items, totalCount] = await repository.findAndCount({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      totalCount,
    };
  }

  async paginateRawRequest<T>(
    rawQuery: SelectQueryBuilder<T>,
    { page, limit }: PaginationParamsDto
  ): Promise<{ items: T[]; totalCount: number }> {
    const totalCount = await rawQuery.getCount();

    console.log("counted");

    rawQuery
    .skip((page - 1) * limit)
    .take(limit);

    console.log(rawQuery.getQuery());

    const items = await rawQuery.getMany();

    return {
      items,
      totalCount,
    };
  }
}
