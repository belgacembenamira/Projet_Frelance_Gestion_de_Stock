import { ProductCommande } from "./ProductCommande";

export interface Commande {
  id?: number;
  date: string;
  totalAmount: number;
  amountPaid: number;
  amountRemaining: number;
  amountBeforeDiscount?: number;
  amountAfterDiscount?: number;
  remise?: number; // Pour le calcul global, si nécessaire
  clientId: number;
  client: {
    id: number;
    name: string;
    address: string;
    phone: string;
    montantTotal: number;
    amountRemaining: number;
  };
  products: ProductCommande[];
}
