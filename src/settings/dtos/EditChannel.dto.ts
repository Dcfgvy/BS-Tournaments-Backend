import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class EditChannelToPostDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ru' })
  language: string;
}