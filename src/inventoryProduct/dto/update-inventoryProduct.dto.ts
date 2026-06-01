import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateInventoryProductDto {
  @IsNotEmpty()
  @IsString()
  name?: string;
  @IsNotEmpty()
  @IsString()
  description?: string;
  @IsNotEmpty()
  @IsNumber()
  tradePrice?: number;
  @IsNotEmpty()
  @IsNumber()
  quantity?: number;
}