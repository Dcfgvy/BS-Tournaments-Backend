import { IsNotEmpty, IsString } from "class-validator";

export class NamesDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;
}