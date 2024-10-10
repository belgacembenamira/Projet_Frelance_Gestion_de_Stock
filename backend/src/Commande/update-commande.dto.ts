// Create a DTO for Commande
export class CommandeDto {
  clientId: number;
  date: Date;
  amountBeforeDiscount: number;
  amountAfterDiscount: number;
  amountPaid: number;
  amountRemaining: number;
  products: ProductCommandeDto[]; // Define a separate DTO for ProductCommande as needed
}

// Create a DTO for ProductCommande
export class ProductCommandeDto {
  productId: number;
  quantity: number;
  discount: number;
}
// update-commande.dto.ts
export class UpdateCommandeDto {
  clientId?: number;
  date?: string;
  products: ProductCommandeDto[]; // Define a separate DTO for ProductCommande as needed
  amountBeforeDiscount?: number;
  amountAfterDiscount?: number;
  amountPaid?: number;
  amountRemaining?: number;
}
