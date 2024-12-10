import { IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreationDatesDto {
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  createdTo?: Date;
}
