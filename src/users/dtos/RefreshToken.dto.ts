import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 256)
  @ApiProperty()
  refreshToken: string;
}