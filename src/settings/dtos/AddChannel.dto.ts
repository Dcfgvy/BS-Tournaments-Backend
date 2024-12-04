import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class AddChannelToPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'my_channel' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ru' })
  language: string;
}