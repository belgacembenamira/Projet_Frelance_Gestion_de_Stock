import { useState, useEffect } from "react";
import { Product } from "../types/Product";
import { getAllProducts } from "../services/ProductService";

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsData: Product[] = await getAllProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return { products, setProducts, fetchProducts };
};
