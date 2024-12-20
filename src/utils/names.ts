import { IsNotEmpty, IsString } from "class-validator";

export type Language = "en" | "ru";

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
