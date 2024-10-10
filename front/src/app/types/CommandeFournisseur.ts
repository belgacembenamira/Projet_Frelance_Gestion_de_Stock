import { ProductCommande } from "./ProductCommande";
import { Supplier } from "./Supplier";

export interface CommandeFournisseur {
  id: number;
  date: Date | null;
  totalAmount: number | null;
  amountPaid: number | null;
  amountRemaining: number | null;
  supplier: Supplier | null;
  products: ProductCommande[];
  amountAfterDiscount: number | null;
  amountBeforeDiscount: number | null;
  commandeId: number | null;
  updatedAt: Date | null;
}
