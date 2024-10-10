import { Commande } from "../types/Commande";
import axios from "axios";

// Récupérer toutes les commandes
export const getAllCommandes = async (): Promise<Commande[]> => {
  try {
    const response = await axios.get("http://localhost:5000/commandes/get"); // Pas besoin de http://localhost:5000
    return response.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch commandes:",
      error?.response?.data || error.message
    );
    throw new Error("Could not retrieve commandes");
  }
};

// Récupérer une commande par ID
export const getCommandeById = async (id: number): Promise<Commande> => {
  try {
    const response = await axios.get(`http://localhost:5000/commande/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to fetch commande with ID ${id}:`,
      error?.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Commande with ID ${id} not found.`);
    }
    throw new Error(`Could not retrieve commande with ID ${id}`);
  }
};

/**
 * Crée une nouvelle commande en envoyant les données à l'axios.
 *
 * @param {Commande} commandeData - Les données de la commande à créer.
 * @returns {Promise<Commande>} - La commande créée ou une erreur si la requête échoue.
 */
export const createCommande = async (
  commandeData: Commande
): Promise<Commande> => {
  try {
    console.log("command envoyer", commandeData);
    const response = await axios.post(
      "http://localhost:5000/commandes",
      commandeData
    ); // Pas besoin de spécifier http://localhost:5000
    return response.data;
  } catch (error: any) {
    console.error(
      "Erreur lors de la création de la commande:",
      error?.response?.data || error.message
    );
    throw new Error("Une erreur inattendue est survenue.");
  }
};

// Mettre à jour une commande existante
export const updateCommande = async (
  id: number,
  commande: Commande
): Promise<Commande> => {
  try {
    const response = await axios.patch(
      `
http://localhost:5000/commandes/${id}`,
      commande
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to update commande with ID ${id}:`,
      error?.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Commande with ID ${id} not found.`);
    }
    throw new Error(`Could not update commande with ID ${id}`);
  }
};

// Supprimer une commande
export const deleteCommande = async (id: number): Promise<void> => {
  try {
    await axios.delete(`http://localhost:5000/commandes/${id}`);
  } catch (error: any) {
    console.error(
      `Failed to delete commande with ID ${id}:`,
      error?.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Commande with ID ${id} not found.`);
    }
    throw new Error(`Could not delete commande with ID ${id}`);
  }
};

// Recherche des commandes par client
export const findCommandesByClient = async (
  clientId: number
): Promise<Commande[]> => {
  try {
    const response = await axios.get(`
http://localhost:5000/commandes/client/${clientId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      `Failed to find commandes by client with ID ${clientId}:`,
      error?.response?.data || error.message
    );
    if (error.response?.status === 404) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }
    throw new Error(`Could not find commandes for client with ID ${clientId}`);
  }
};
// Ajouter un produit à une commande
export const addProductToCommande = async (
  id: number,
  productData: { id: number; quantity: number; discount?: number }
): Promise<void> => {
  try {
    await axios.post(
      `http://localhost:5000/commandes/${id}/products`,
      productData
    );
  } catch (error: any) {
    console.error(
      `Failed to add product to commande with ID ${id}:`,
      error?.response?.data || error.message
    );
    throw new Error(`Could not add product to commande with ID ${id}`);
  }
};

// Mettre à jour un produit dans une commande
export const updateProductInCommande = async (
  commandeId: number,
  productId: number,
  updateData: { quantity?: number; discount?: number }
): Promise<void> => {
  try {
    await axios.patch(
      `http://localhost:5000/commandes/${commandeId}/products/${productId}`,
      updateData
    );
  } catch (error: any) {
    console.error(
      `Failed to update product with ID ${productId} in commande with ID ${commandeId}:`,
      error?.response?.data || error.message
    );
    throw new Error(
      `Could not update product with ID ${productId} in commande with ID ${commandeId}`
    );
  }
};

// Supprimer un produit d'une commande
export const removeProductFromCommande = async (
  commandeId: number,
  productId: number
): Promise<void> => {
  try {
    await axios.delete(
      `http://localhost:5000/commandes/${commandeId}/products/${productId}`
    );
  } catch (error: any) {
    console.error(
      `Failed to remove product with ID ${productId} from commande with ID ${commandeId}:`,
      error?.response?.data || error.message
    );
    throw new Error(
      `Could not remove product with ID ${productId} from commande with ID ${commandeId}`
    );
  }
};
