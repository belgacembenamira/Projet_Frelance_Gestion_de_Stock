import React, { useState, memo } from "react";
import { Commande } from "../types/Commande";
import { TextField, Button, Box, Typography } from "@mui/material";

interface CommandeUpdateFormProps {
  commande: Commande;
  onUpdate: (id: number, updatedCommande: Commande) => Promise<void>;
}

const CommandeUpdateForm: React.FC<CommandeUpdateFormProps> = memo(({ commande, onUpdate }) => {
  const [updatedCommande, setUpdatedCommande] = useState<Commande>(commande);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedCommande((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Réinitialiser le message d'erreur

    // Validation basique
    if (!updatedCommande.id) {
      setError("L'ID de la commande est invalide.");
      return;
    }

    try {
      await onUpdate(updatedCommande.id, updatedCommande);
      // Optionnel : réinitialiser le formulaire ou afficher un message de succès
    } catch (err) {
      setError("Échec de la mise à jour de la commande. Veuillez réessayer.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>Mettre à jour la commande</Typography>
      {error && <Typography color="error">{error}</Typography>}

      <TextField
        fullWidth
        margin="normal"
        label="Montant Avant Remise"
        name="amountBeforeDiscount"
        type="number"
        value={updatedCommande.amountBeforeDiscount}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Montant Payé"
        name="amountPaid"
        type="number"
        value={updatedCommande.amountPaid}
        onChange={handleChange}
        required
      />

      <TextField
        fullWidth
        margin="normal"
        label="Montant Restant"
        name="amountRemaining"
        type="number"
        value={updatedCommande.amountRemaining}
        onChange={handleChange}
        required
      />

      {/* Ajouter d'autres champs si nécessaire */}

      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Mettre à jour
      </Button>
    </Box>
  );
});

export default CommandeUpdateForm;
