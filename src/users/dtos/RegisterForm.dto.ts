import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches, IsNumber } from "class-validator";

export class RegisterFormDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^#/, {
    message: 'Brawl Stars tag must start with #',
  })
  @ApiProperty({ example: '#TAG123' })
  tag: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 32)
  @ApiProperty()
  password: string;
  
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 4 })
  trophyChange: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  @ApiProperty({ example: 'en' })
  language: string;
}