import { CommandeFournisseur } from "./CommandeFournisseur";
import { ProductCommande } from "./ProductCommande";

export interface Supplier {
  contactPhone?: string;
  taxId?: string;
  id?: number;
  name: string;
  matriculeFiscal?: string;
  codeTVA?: string;
  codeCategorie?: string;
  nEtabSecondaire?: string;
  rue?: string;
  email: string;
  productCommandes?: ProductCommande[]; // Assuming a ProductCommande interface exists
  commandeFournisseur?: CommandeFournisseur[]; // Assuming a CommandeFournisseur interface exists
}
