// src/hooks/useCommandeFournisseur.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { createCommandeFournisseur } from "../services/commandeFournisseurApi";
import { CommandeFournisseur } from "../types/CommandeFournisseur";

export const useCreateCommandeFournisseur = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CommandeFournisseur, Error, CommandeFournisseur>(
    {
      mutationFn: createCommandeFournisseur,
      onSuccess: (newCommande) => {
        queryClient.invalidateQueries({ queryKey: ["commande-fournisseurs"] });
        Swal.fire(
          "Succès",
          "Commande fournisseur créée avec succès",
          "success"
        );
      },
      onError: () => {
        Swal.fire(
          "Erreur",
          "Échec de la création de la commande fournisseur",
          "error"
        );
      },
    }
  );

  return mutation;
};
