import { IsNotEmpty, IsString } from "class-validator";

export class EditChannelToPostDto {
  @IsNotEmpty()
  @IsString()
  language: string;
}