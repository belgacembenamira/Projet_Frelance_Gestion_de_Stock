import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientApi";
import { Client } from "../types/Client";

export const useClients = () => {
  const queryClient = useQueryClient();

  // Fetch all clients
  const {
    data: clients,
    isLoading,
    error,
  } = useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: getAllClients,
  });

  // Add client mutation
  const addClientMutation = useMutation<Client, Error, Client>({
    mutationFn: (client: Client) => createClient(client),
    onSuccess: (newClient: Client) => {
      queryClient.setQueryData<Client[]>(["clients"], (oldClients) =>
        oldClients ? [...oldClients, newClient] : [newClient]
      );
      Swal.fire("Succès", "Client ajouté avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de l'ajout du client", "error");
    },
  });

  // Update client mutation
  const updateClientMutation = useMutation<
    Client,
    Error,
    { id: number; data: Partial<Client> }
  >({
    mutationFn: ({ id, data }: { id: number; data: Partial<Client> }) =>
      updateClient(id, data),
    onSuccess: (updatedClient: Client) => {
      queryClient.setQueryData<Client[]>(["clients"], (oldClients) =>
        oldClients
          ? oldClients.map((client) =>
              client.id === updatedClient.id ? updatedClient : client
            )
          : []
      );
      Swal.fire("Succès", "Client mis à jour avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de la mise à jour du client", "error");
    },
  });

  // Delete client mutation
  const deleteClientMutation = useMutation<void, Error, number>({
    mutationFn: deleteClient,
    onSuccess: (_, id: number) => {
      queryClient.setQueryData<Client[]>(["clients"], (oldClients) =>
        oldClients ? oldClients.filter((client) => client.id !== id) : []
      );
      Swal.fire("Succès", "Client supprimé avec succès", "success");
    },
    onError: () => {
      Swal.fire("Erreur", "Échec de la suppression du client", "error");
    },
  });

  return {
    clients,
    loading: isLoading,
    error,
    addClient: addClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
  };
};
