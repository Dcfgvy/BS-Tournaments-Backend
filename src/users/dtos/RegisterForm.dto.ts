import { IsNotEmpty, IsString, Length, Matches, IsNumber } from "class-validator";

export class RegisterFormDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^#/, {
    message: 'Brawl Stars tag must start with #',
  })
  tag: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  password: string;
  
  @IsNotEmpty()
  @IsNumber()
  trophyChange: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  language: string;
}