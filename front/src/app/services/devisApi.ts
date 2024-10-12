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
  if (error.response?.status === 500) {
    throw new Error(`Server error while trying to ${context}.`);
  }
  throw new Error(`Could not ${context}`);
};

// Récupérer tous les devis
export const getAllDevis = async (): Promise<Devis[]> => {
  try {
    const response = await api.get("/devis");
    return response.data;
  } catch (error) {
    handleApiError(error, "fetch devis");
    return []; // Optionnel: ne sera pas atteint grâce à l'exception
  }
};

// Récupérer un devis par ID
export const getDevisById = async (id: number): Promise<Devis | undefined> => {
  try {
    const response = await api.get(`/devis/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `fetch devis with ID ${id}`);
    return undefined; // Assurez-vous que la fonction retourne un type correct
  }
};

// Créer un nouveau devis
export const createDevis = async (
  devisData: Devis
): Promise<Devis | undefined> => {
  try {
    const response = await api.post("/devis", devisData);
    return response.data;
  } catch (error) {
    handleApiError(error, "create devis");
    return undefined; // Assurez-vous que la fonction retourne un type correct
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
  } catch (error) {
    handleApiError(error, `update devis with ID ${id}`);
    return undefined; // Assurez-vous que la fonction retourne un type correct
  }
};

// Supprimer un devis
export const deleteDevis = async (id: number): Promise<void> => {
  try {
    await api.delete(`/devis/${id}`);
  } catch (error) {
    handleApiError(error, `delete devis with ID ${id}`);
  }
};

// Recherche des devis par client
export const findDevisByClient = async (
  clientId: number
): Promise<Devis[] | undefined> => {
  try {
    const response = await api.get(`/devis/client/${clientId}`);
    return response.data;
  } catch (error) {
    handleApiError(error, `find devis by client with ID ${clientId}`);
    return undefined; // Assurez-vous que la fonction retourne un type correct
  }
};

// Transformer un devis en commande
export const transformDevisToCommande = async (
  devisId: number
): Promise<void> => {
  try {
    await api.post(`/devis/${devisId}/transform-to-commande`);
  } catch (error) {
    handleApiError(error, `transform devis with ID ${devisId} to commande`);
  }
};
