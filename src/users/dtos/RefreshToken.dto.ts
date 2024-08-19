import { IsNotEmpty, IsString, Length } from "class-validator";

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 256)
  refreshToken: string;
}