import axios, { AxiosError } from "axios";
import { Supplier } from "../types/Supplier";

// Create an axios instance for reusable baseURL and configuration
const api = axios.create({
  baseURL: "http://localhost:5000/suppliers",
  headers: {
    "Content-Type": "application/json",
  },
});

// Error handler for logging and providing custom error messages
const handleError = (error: AxiosError) => {
  console.error(error);
  const errorMessage =
    (error.response?.data as { message?: string })?.message ||
    "API request failed";
  throw new Error(errorMessage);
};

// Fetch all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await axios.get("http://localhost:5000/suppliers");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return []; // Return an empty array in case of an error
  }
};

// Fetch supplier by ID
export const getSupplierById = async (
  id: number
): Promise<Supplier | undefined> => {
  try {
    const response = await axios.get(`http://localhost:5000/suppliers/${id}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined; // Return undefined in case of an error
  }
};

// Create a new supplier
export const createSupplier = async (
  supplier: Supplier
): Promise<Supplier | undefined> => {
  try {
    const response = await axios.post(
      "http://localhost:5000/suppliers",
      supplier
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined; // Return undefined in case of an error
  }
};

// Update supplier by ID
export const updateSupplier = async (
  id: number,
  supplier: Partial<Supplier>
): Promise<Supplier | undefined> => {
  try {
    const response = await axios.patch(
      `http://localhost:5000/suppliers/${id}`,
      supplier
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined; // Return undefined in case of an error
  }
};

// Delete supplier by ID
export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    await api.delete(`http://localhost:5000/suppliers/${id}`);
  } catch (error) {
    handleError(error as AxiosError);
  }
};

// Find suppliers by name (search functionality)
export const findSuppliersByName = async (
  name: string
): Promise<Supplier[] | undefined> => {
  try {
    const response = await axios.get(
      `http://localhost:5000/suppliers/name/${name}`
    );
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined; // Return undefined in case of an error
  }
};
