import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class PaginationParamsDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  @Max(100)
  limit: number;
}
