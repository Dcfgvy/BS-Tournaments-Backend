import { ApiProperty } from "@nestjs/swagger";

export class TgConnectionLinkResponseDto {
  @ApiProperty({ example: 'https://t.me/bot_username?start=abcde12345' })
  link: string;
}