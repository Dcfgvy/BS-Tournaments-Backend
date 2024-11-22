import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangeAdminSettingDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 256)
  @ApiProperty({ example: 'organizerFee' })
  key: string;

  @IsNotEmpty()
  @ApiProperty({ example: 120 })
  value: any;
}