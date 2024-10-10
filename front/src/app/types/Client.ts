import { Commande } from "./Commande";

export interface Client {
  id?: number;
  name?: string;
  address?: string;
  phone?: string;
  totalAmountToPay?: number;
  amountRemaining?: number;
  amountPaid?: number; // Add this line

  commandes?: Commande[];
}
