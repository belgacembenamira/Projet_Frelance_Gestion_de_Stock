import { Product } from "./Product";

export interface ProductCommande {
  productId: any;
  id?: number; // Ajouté pour inclure l'ID si nécessaire
  totalPrice: number; // Changez le type pour le rendre plus spécifique
  price: number;
  reference: string;
  description: string;
  quantity: number;
  product: Product;
  discount?: number; // Inclure la remise si nécessaire
  supplierPrice?: number; // Inclure la remise si nécessaire
}
