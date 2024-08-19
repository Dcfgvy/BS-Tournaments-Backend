import { IsNotEmpty, IsNumber, IsString, Length, Matches } from "class-validator";

export class TagConfirmationDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^#/, {
    message: 'Brawl Stars tag must start with #',
  })
  tag: string;

  @IsNotEmpty()
  @IsNumber()
  trophyChange: number;
}