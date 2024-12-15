import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 100, description: 'Total number of items' })
  totalItems: number;

  @ApiProperty({ example: 10, description: 'Number of items on the current page' })
  itemCount: number;

  @ApiProperty({ example: 10, description: 'Number of items per page' })
  itemsPerPage: number;

  @ApiProperty({ example: 10, description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ example: 1, description: 'Current page number' })
  currentPage: number;
}

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true, description: 'List of items' })
  items: T[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  meta: PaginationMeta;
}
