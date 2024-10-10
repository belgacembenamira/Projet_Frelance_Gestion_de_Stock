import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Supplier } from "../types/Supplier";
import {
  createSupplier,
  deleteSupplier,
  getAllSuppliers,
  updateSupplier,
} from "../services/supplierApi";

export const useSuppliers = () => {
  const queryClient = useQueryClient();

  // Fetch all suppliers
  const {
    data: suppliers,
    isLoading,
    error,
  } = useQuery<Supplier[], Error>({
    queryKey: ["suppliers"],
    queryFn: getAllSuppliers,
  });

  // Add supplier mutation
  const addSupplierMutation = useMutation<Supplier, Error, Supplier>({
    mutationFn: createSupplier,
    onSuccess: (newSupplier) => {
      queryClient.setQueryData<Supplier[]>(["suppliers"], (oldSuppliers) =>
        oldSuppliers ? [...oldSuppliers, newSupplier] : [newSupplier]
      );
      Swal.fire("Succès", "Fournisseur ajouté avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de l'ajout du fournisseur", "error");
    },
  });

  // Update supplier mutation
  const updateSupplierMutation = useMutation<
    Supplier,
    Error,
    { id: number; data: Partial<Supplier> }
  >({
    mutationFn: ({ id, data }) => updateSupplier(id, data),
    onSuccess: (updatedSupplier) => {
      queryClient.setQueryData<Supplier[]>(["suppliers"], (oldSuppliers) =>
        oldSuppliers
          ? oldSuppliers.map((supplier) =>
              supplier.id === updatedSupplier.id ? updatedSupplier : supplier
            )
          : []
      );
      Swal.fire("Succès", "Fournisseur mis à jour avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de la mise à jour du fournisseur", "error");
    },
  });

  // Delete supplier mutation
  const deleteSupplierMutation = useMutation<void, Error, number>({
    mutationFn: deleteSupplier,
    onSuccess: (_, id) => {
      queryClient.setQueryData<Supplier[]>(["suppliers"], (oldSuppliers) =>
        oldSuppliers
          ? oldSuppliers.filter((supplier) => supplier.id !== id)
          : []
      );
      Swal.fire("Succès", "Fournisseur supprimé avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de la suppression du fournisseur", "error");
    },
  });

  return {
    suppliers,
    loading: isLoading,
    error,
    addSupplier: addSupplierMutation.mutate,
    updateSupplier: updateSupplierMutation.mutate,
    deleteSupplier: deleteSupplierMutation.mutate,
  };
};
