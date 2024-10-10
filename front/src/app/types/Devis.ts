import { ProductCommande } from "./ProductCommande";

export interface Devis {
  id?: number;
  date: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  amountBeforeDiscount?: number;
  amountAfterDiscount?: number;
  remise?: number; // Pour le calcul global, si nécessaire
  clientId: number;
  client: { id: number; name: string; address: string; phone: string };
  products: ProductCommande[];
}
