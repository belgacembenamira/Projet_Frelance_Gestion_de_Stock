import axios from "axios";
import { Client } from "../types/Client";

export const getAllClients = async (): Promise<Client[]> => {
  const response = await axios.get("http://localhost:5000/client");
  return response.data;
};

export const getClientById = async (id: number): Promise<Client> => {
  const response = await axios.get(`http://localhost:5000/client/${id}`);
  return response.data;
};

export const createClient = async (client: Client): Promise<Client> => {
  const response = await axios.post("http://localhost:5000/client", client);
  return response.data;
};

export const updateClient = async (
  id: number,
  client: Partial<Client>
): Promise<Client> => {
  const response = await axios.patch(
    `http://localhost:5000/client/${id}`,
    client
  );
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:5000/client/${id}`);
};

export const findClientsByName = async (name: string): Promise<Client[]> => {
  const response = await axios.get(`http://localhost:5000/client/name/${name}`);
  return response.data;
};
