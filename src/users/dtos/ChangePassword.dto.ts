import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  @ApiProperty()
  newPassword: string;
}