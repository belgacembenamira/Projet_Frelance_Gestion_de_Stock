import { Product } from "./Product";

export interface ProductModalProps {
  isOpen: boolean;
  product: Product;
  onClose: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}
