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
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return []; // This line will never be reached due to the throw in handleError
  }
};

// Fetch supplier by ID
export const getSupplierById = async (
  id: number
): Promise<Supplier | undefined> => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    return undefined;
  }
};

// Create a new supplier with validation
export const createSupplier = async (supplier: Supplier): Promise<Supplier> => {
  if (!supplier.name || !supplier.email) {
    throw new Error("Supplier name and email are required");
  }

  try {
    const response = await api.post("/", supplier);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw new Error("Failed to create supplier");
  }
};

// Update supplier by ID
export const updateSupplier = async (
  id: number,
  supplier: Partial<Supplier>
): Promise<Supplier> => {
  try {
    const response = await api.put(`/${id}`, supplier);
    return response.data;
  } catch (error) {
    handleError(error as AxiosError);
    throw new Error("Failed to update supplier");
  }
};

// Delete supplier by ID
export const deleteSupplier = async (id: number): Promise<void> => {
  try {
    await api.delete(`/${id}`);
  } catch (error) {
    handleError(error as AxiosError);
  }
};
