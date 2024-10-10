// src/api/productApi.ts
import api from "./axios";
import { Product } from "../types/Product";

// Récupérer tous les produits
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/products"); // Utilisation de l'instance `api`
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    throw error; // Propager l'erreur pour permettre la gestion dans les composants
  }
};

// Créer un nouveau produit
export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await api.post("/products", product); // Instance `api` gère la base URL
    return response.data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

// Mettre à jour un produit existant
export const updateProduct = async (
  id: number,
  product: Partial<Product> // Utilisation de `Partial<Product>` pour les mises à jour partielles
): Promise<Product> => {
  try {
    const response = await api.patch(`/products/${id}`, product); // Suppression de la barre oblique supplémentaire
    return response.data;
  } catch (error) {
    console.error(`Failed to update product with ID ${id}:`, error);
    throw error;
  }
};

// Supprimer un produit
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/products/${id}`); // Suppression de la barre oblique supplémentaire
  } catch (error) {
    console.error(`Failed to delete product with ID ${id}:`, error);
    throw error;
  }
};

// Mettre à jour la quantité d'un produit après une commande
export const updateProductStock = async (
  id: number,
  quantity: number
): Promise<void> => {
  try {
    const response = await api.patch(`/products/${id}`, { quantity }); // Correction de l'URL
    return response.data;
  } catch (error) {
    console.error(`Failed to update stock for product with ID ${id}:`, error);
    throw error;
  }
};
export const getProductStock = async (id: number): Promise<number> => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data.quantity; // Assurez-vous que votre API renvoie bien la quantité
  } catch (error) {
    console.error("Failed to fetch product stock:", error);
    throw error;
  }
};
