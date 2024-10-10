import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommandeFournisseurDto {
  @IsNotEmpty()
  supplierId: number;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsNumber()
  amountRemaining?: number;
  @IsOptional()
  supplier: any; // Add the supplier property

  @IsOptional()
  @IsNumber()
  amountAfterDiscount?: number;

  @IsOptional()
  @IsNumber()
  amountBeforeDiscount?: number;

  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
export class UpdateCommandeFournisseurDto {
  @IsOptional()
  supplierId?: number;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsNumber()
  amountPaid?: number;

  @IsOptional()
  @IsNumber()
  amountRemaining?: number;

  @IsOptional()
  @IsNumber()
  amountAfterDiscount?: number;

  @IsOptional()
  @IsNumber()
  amountBeforeDiscount?: number;

  @IsOptional()
  productId?: number;

  @IsOptional()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  discount?: number;
}
