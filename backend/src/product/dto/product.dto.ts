import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  supplierPrice?: number;

  @IsOptional()
  @IsString()
  unite?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  price?: number;

  @IsOptional()
  @IsNumber()
  supplierPrice?: number;

  @IsOptional()
  @IsString()
  unite?: string;
}
