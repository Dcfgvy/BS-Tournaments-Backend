import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length, Matches, IsOptional, IsInt } from "class-validator";

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

  // used to link the telegram account automatically (when registering from the tg mini app)
  @IsOptional()
  @ApiProperty({ example: { hash: 'some_hash', user: { id: 12345 } } })
  telegramData?: any;
  /*
    {
      "hash": string,
      "user": {
        "id": integer
      }
    }
  */
  
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 4 })
  trophyChange: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 20)
  @ApiProperty({ example: 'en' })
  language: string;
}