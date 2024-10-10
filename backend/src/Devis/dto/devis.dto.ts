import {
  IsOptional,
  IsNumber,
  IsArray,
  IsString,
  IsNotEmpty,
} from 'class-validator';

// CreateDevisDto allows null values
export class CreateDevisDto {
  @IsOptional()
  @IsNumber()
  clientId?: number | null; // Make it optional

  @IsOptional()
  @IsArray()
  products?: ProductCommandeDto[] | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountBeforeDiscount?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountAfterDiscount?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountPaid?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountRemaining?: number | null; // Make it optional
}

// UpdateDevisDto allows null values
export class UpdateDevisDto {
  @IsOptional()
  @IsNumber()
  clientId?: number | null; // Make it optional

  @IsOptional()
  @IsArray()
  products?: ProductCommandeDto[] | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountBeforeDiscount?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountAfterDiscount?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountPaid?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  amountRemaining?: number | null; // Make it optional
}

// Assuming ProductCommandeDto is defined like this
class ProductCommandeDto {
  @IsOptional()
  @IsNumber()
  id?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  quantity?: number | null; // Make it optional

  @IsOptional()
  @IsNumber()
  discount?: number | null; // Make it optional
}
