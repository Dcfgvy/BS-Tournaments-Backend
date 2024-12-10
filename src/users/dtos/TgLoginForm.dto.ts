import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TgLoginFormDto {
  @IsNotEmpty()
  @ApiProperty({ example: { hash: 'some_hash', user: { id: 12345 } } })
  telegramData: any;
}