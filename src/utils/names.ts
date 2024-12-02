import { IsNotEmpty, IsString } from "class-validator";

export class NamesDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ru: string;
}

export interface INames {
  en: string;
  ru: string;
}