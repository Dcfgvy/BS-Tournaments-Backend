import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class LoginFormDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  @ApiProperty({ example: '#TAG123' })
  tag: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 32)
  @ApiProperty()
  password: string;
}