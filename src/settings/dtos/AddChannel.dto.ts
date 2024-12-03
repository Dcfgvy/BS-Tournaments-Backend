import { IsNotEmpty, IsString } from "class-validator";

export class AddChannelToPostDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  language: string;
}