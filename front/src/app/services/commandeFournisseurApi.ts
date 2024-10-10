import axios from "axios";
import { CommandeFournisseur } from "../types/CommandeFournisseur";

export const getAllCommandeFournisseur = async (): Promise<
  CommandeFournisseur[]
> => {
  const response = await axios.get(
    "http://localhost:5000/commande-fournisseur"
  );
  return response.data;
};

export const getCommandeFournisseurById = async (
  id: number
): Promise<CommandeFournisseur> => {
  const response = await axios.get(
    `http://localhost:5000/commande-fournisseur/${id}`
  );
  return response.data;
};

export const createCommandeFournisseur = async (
  commande: CommandeFournisseur
): Promise<CommandeFournisseur> => {
  const response = await axios.post(
    "http://localhost:5000/commande-fournisseur",
    commande
  );
  return response.data;
};

export const updateCommandeFournisseur = async (
  id: number,
  commande: Partial<CommandeFournisseur>
): Promise<CommandeFournisseur> => {
  const response = await axios.put(
    `http://localhost:5000/commande-fournisseur/${id}`,
    commande
  );
  return response.data;
};

export const deleteCommandeFournisseur = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:5000/commande-fournisseur/${id}`);
};

// Example to find orders by supplier ID
export const findCommandeFournisseurBySupplierId = async (
  supplierId: number
): Promise<CommandeFournisseur[]> => {
  const response = await axios.get(
    `http://localhost:5000/commande-fournisseur/supplier/${supplierId}`
  );
  return response.data;
};
