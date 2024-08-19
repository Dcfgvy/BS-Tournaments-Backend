import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginFormDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;
}