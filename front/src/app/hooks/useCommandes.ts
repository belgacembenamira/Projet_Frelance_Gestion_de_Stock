// hooks/useCommandes.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Commande } from "../types/Commande";
import {
  addProductToCommande,
  createCommande,
  deleteCommande,
  getAllCommandes,
  removeProductFromCommande,
  updateCommande,
  updateProductInCommande,
} from "../services/commandeApi";
import Swal from "sweetalert2";

// Custom hook to manage commandes
export const useCommandes = () => {
  const queryClient = useQueryClient();

  // Retrieve all commandes
  const {
    data: commandes,
    error,
    isLoading,
  } = useQuery<Commande[], Error>({
    queryKey: ["commandes"],
    queryFn: getAllCommandes,
  });

  // Mutation to add a commande
  const addCommandeMutation = useMutation<Commande, Error, Commande>({
    mutationFn: createCommande,
    onSuccess: (newCommande) => {
      queryClient.setQueryData<Commande[]>(["commandes"], (oldData) => [
        ...(oldData || []),
        newCommande,
      ]);
      Swal.fire("Success", "Commande added successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to add commande", "error");
    },
  });

  // Mutation to update a commande
  const updateCommandeMutation = useMutation<
    Commande,
    Error,
    { id: number; updateData: Commande }
  >({
    mutationFn: ({ id, updateData }) => updateCommande(id, updateData),
    onSuccess: (updatedCommande, { id }) => {
      queryClient.setQueryData<Commande[]>(["commandes"], (oldData) =>
        (oldData || []).map((commande) =>
          commande.id === id ? updatedCommande : commande
        )
      );
      Swal.fire("Success", "Commande updated successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update commande", "error");
    },
  });

  // Mutation to delete a commande
  const removeCommandeMutation = useMutation<void, Error, number>({
    mutationFn: deleteCommande,
    onSuccess: (id) => {
      queryClient.setQueryData<Commande[]>(["commandes"], (oldData) =>
        (oldData || []).filter((commande) => commande.id !== id)
      );
      Swal.fire("Success", "Commande deleted successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete commande", "error");
    },
  });

  // Mutation to add a product to a commande
  const addProductMutation = useMutation<
    void,
    Error,
    {
      commandeId: number;
      productData: { id: number; quantity: number; discount?: number };
    }
  >({
    mutationFn: ({ commandeId, productData }) =>
      addProductToCommande(commandeId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      Swal.fire("Success", "Product added to commande successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to add product to commande", "error");
    },
  });

  // Mutation to update a product in a commande
  const updateProductMutation = useMutation<
    void,
    Error,
    {
      commandeId: number;
      productId: number;
      updateData: { quantity?: number; discount?: number };
    }
  >({
    mutationFn: ({ commandeId, productId, updateData }) =>
      updateProductInCommande(commandeId, productId, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      Swal.fire("Success", "Product updated successfully", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to update product", "error");
    },
  });

  // Mutation to remove a product from a commande
  const removeProductMutation = useMutation<
    void,
    Error,
    { commandeId: number; productId: number }
  >({
    mutationFn: ({ commandeId, productId }) =>
      removeProductFromCommande(commandeId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes"] });
      Swal.fire(
        "Success",
        "Product removed from commande successfully",
        "success"
      );
    },
    onError: () => {
      Swal.fire("Error", "Failed to remove product from commande", "error");
    },
  });

  return {
    commandes,
    addCommande: addCommandeMutation.mutate,
    updateCommandeData: updateCommandeMutation.mutate,
    removeCommande: removeCommandeMutation.mutate,
    addProduct: addProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    removeProduct: removeProductMutation.mutate,
    loading: isLoading,
    error: error?.message,
  };
};
