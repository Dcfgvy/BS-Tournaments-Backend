import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationParams {
  @IsInt()
  @Min(1)
  @IsOptional()
  pageNumber: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize: number = 10;
}