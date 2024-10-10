import axios from "axios";
import { Devis } from "../types/Devis";
import api from "./axios";

// Centralized error handling
const handleApiError = (error: any, context: string) => {
  console.error(
    `Failed to ${context}:`,
    error?.response?.data || error.message
  );
  if (error.response?.status === 404) {
    throw new Error(`${context} not found.`);
  }
  throw new Error(`Could not ${context}`);
};

// Récupérer tous les devis
export const getAllDevis = async (): Promise<Devis[] | []> => {
  try {
    const response = await api.get("/devis");
    return response.data;
  } catch (error: any) {
    handleApiError(error, "fetch devis");
    return [];
  }
};

// Récupérer un devis par ID
export const getDevisById = async (
  id: number
): Promise<Devis[] | undefined> => {
  try {
    const response = await api.get(`/devis/${id}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `fetch devis with ID ${id}`);
  }
};

// Créer un nouveau devis
export const createDevis = async (
  devisData: Devis
): Promise<Devis | undefined> => {
  try {
    const response = await axios.post("/devis", devisData);
    return response.data;
  } catch (error: any) {
    handleApiError(error, "create devis");
  }
};

// Mettre à jour un devis existant
export const updateDevis = async (
  id: number,
  devis: Devis
): Promise<Devis | undefined> => {
  try {
    const response = await api.patch(`/devis/${id}`, devis);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `update devis with ID ${id}`);
  }
};

// Supprimer un devis
export const deleteDevis = async (id: number): Promise<void> => {
  try {
    await api.delete(`/devis/${id}`);
  } catch (error: any) {
    handleApiError(error, `delete devis with ID ${id}`);
  }
};

// Recherche des devis par client
export const findDevisByClient = async (
  clientId: number
): Promise<Devis | undefined> => {
  try {
    const response = await api.get(`/devis/client/${clientId}`);
    return response.data;
  } catch (error: any) {
    handleApiError(error, `find devis by client with ID ${clientId}`);
  }
};

// Transformer un devis en commande
export const transformDevisToCommande = async (
  devisId: number
): Promise<void> => {
  try {
    await api.post(`/devis/${devisId}/transform-to-commande`);
  } catch (error: any) {
    handleApiError(error, `transform devis with ID ${devisId} to commande`);
  }
};
