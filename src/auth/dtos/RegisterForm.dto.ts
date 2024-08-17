import { Exclude } from "class-transformer";
import { IsNotEmpty, IsString, IsStrongPassword, Length, Matches } from "class-validator";

export class RegisterFormDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  @Matches(/^[A-Za-z][A-Za-z0-9]*$/, {
    message: 'Username must start with a letter and contain only letters and digits.',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  language: string;
}