import { Product } from "./Product";

export interface ProductTableProps {
  products: Product[];
  onDeleteProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
}
