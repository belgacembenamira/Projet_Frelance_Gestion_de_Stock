export interface Product {
  id: number; // Unique identifier for the product
  reference: string; // Product reference code
  description: string; // Detailed description of the product
  quantity: number; // Quantity available for the product
  price: number; // Base price of the product
  supplierPrice: number; // Price offered by the supplier
  unite?: string; // Unit of measurement (e.g., kg, pieces)
  unitPrice?: number; // Price per unit, optional for clarity
  priceAfterDiscount?: number; // Price after applying any discounts, optional
  totalPrice?: number; // Total price based on quantity, optional
  taxRate?: number; // Applicable tax rate (e.g., VAT), optional
  notes?: string; // Additional notes or comments about the product, optional
}
