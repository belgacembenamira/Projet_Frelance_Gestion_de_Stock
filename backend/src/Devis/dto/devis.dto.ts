import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsNumber, IsArray, IsDateString } from 'class-validator';

export class CreateDevisDto {
  @IsNumber()
  @IsOptional()
  clientId: number;

  @IsDateString()
  @IsOptional() // Permet de ne pas fournir de valeur ou d'accepter un champ vide
  date?: string | null;

  @IsArray()
  products: { id: number; quantity: number; discount?: number | null }[];

  @IsNumber()
  @IsOptional()
  amountBeforeDiscount?: number | null;

  @IsNumber()
  @IsOptional()
  amountAfterDiscount?: number | null;

  @IsNumber()
  @IsOptional()
  amountPaid?: number | null;

  @IsNumber()
  @IsOptional()
  amountRemaining?: number | null;
}

export class UpdateDevisDto extends PartialType(CreateDevisDto) {}
