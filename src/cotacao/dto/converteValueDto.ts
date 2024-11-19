import { IsString, IsNumber, IsPositive, Length } from 'class-validator';

export class ConvertValueDto {
  @IsString()
  @Length(3, 3)
  baseCurrency: string;

  @IsString()
  @Length(3, 3)
  targetCurrency: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
