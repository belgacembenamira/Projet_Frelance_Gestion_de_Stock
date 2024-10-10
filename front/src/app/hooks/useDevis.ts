import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  getAllDevis,
  getDevisById,
  createDevis,
  updateDevis,
  deleteDevis,
} from "../services/devisApi";
import { Devis } from "../types/Devis";

export const useDevis = () => {
  const queryClient = useQueryClient();

  // Fetch all devis
  const {
    data: devis,
    isLoading,
    isError,
    error,
  } = useQuery<Devis[], Error>({
    queryKey: ["devis"],
    queryFn: getAllDevis,
  });

  if (error) {
    Swal.fire("Error", "Failed to fetch devis", "error");
  }

  // Invalidate queries on mutation success
  const invalidateDevisQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["devis"] });
  };

  // Add devis
  const addDevisMutation = useMutation<Devis, Error, Devis, void>({
    mutationFn: createDevis,
    onSuccess: (newDevis: Devis) => {
      queryClient.setQueryData<Devis[]>(
        ["devis"],
        (oldDevis: Devis[] | undefined) => [...(oldDevis || []), newDevis]
      );
      Swal.fire("Success", "Devis added successfully", "success");
      invalidateDevisQueries();
    },
    onError: () => {
      Swal.fire("Error", "Failed to add devis", "error");
    },
  });

  // Update devis
  const updateDevisMutation = useMutation<
    Devis,
    Error,
    { id: number; devis: Devis }
  >({
    mutationFn: ({ id, devis }) => updateDevis(id, devis),
    onSuccess: (updatedDevis) => {
      queryClient.setQueryData<Devis[]>(
        ["devis"],
        (oldDevis: Devis[] | undefined) =>
          oldDevis?.map((devis: Devis) =>
            devis.id === updatedDevis.id ? updatedDevis : devis
          )
      );
      Swal.fire("Success", "Devis updated successfully", "success");
      invalidateDevisQueries();
    },
    onError: () => {
      Swal.fire("Error", "Failed to update devis", "error");
    },
  });

  // Remove devis
  const removeDevisMutation = useMutation<number, Error, number>({
    mutationFn: async (id: number) => {
      await deleteDevis(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Devis[]>(["devis"], (oldDevis) =>
        oldDevis?.filter((devis: Devis) => devis.id !== id)
      );
      Swal.fire("Success", "Devis deleted successfully", "success");
      invalidateDevisQueries();
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete devis", "error");
    },
  });

  // Fetch devis by ID
  const fetchDevisById = async (id: number) => {
    try {
      return await getDevisById(id);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch devis", "error");
    }
  };

  return {
    devis,
    fetchDevisById,
    addDevis: addDevisMutation.mutate,
    updateDevisData: updateDevisMutation.mutate,
    removeDevis: removeDevisMutation.mutate,
    isLoading,
    isError,
  };
};

export default useDevis;
