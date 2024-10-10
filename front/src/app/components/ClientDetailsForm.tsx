import React, { memo, useCallback } from "react";
import { Box, Typography, TextField } from "@mui/material";

interface ClientDetailsFormProps {
  nomClient: string;
  adresseClient: string;
  telephoneClient: string;
  setNomClient: (value: string) => void;
  setAdresseClient: (value: string) => void;
  setTelephoneClient: (value: string) => void;
}

const ClientDetailsForm: React.FC<ClientDetailsFormProps> = memo(({
  nomClient,
  adresseClient,
  telephoneClient,
  setNomClient,
  setAdresseClient,
  setTelephoneClient,
}) => {
  // Use useCallback to memoize the handlers
  const handleNomChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNomClient(e.target.value);
  }, [setNomClient]);

  const handleAdresseChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAdresseClient(e.target.value);
  }, [setAdresseClient]);

  const handleTelephoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTelephoneClient(e.target.value);
  }, [setTelephoneClient]);

  return (
    <Box mb={3} sx={{ maxWidth: "600px", mx: "auto" }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
        Détails du Client
      </Typography>

      <TextField
        label="Nom"
        variant="outlined"
        fullWidth
        margin="normal"
        value={nomClient}
        onChange={handleNomChange}
        placeholder="Entrez le nom du client"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' },
        }}
      />

      <TextField
        label="Adresse"
        variant="outlined"
        fullWidth
        margin="normal"
        value={adresseClient}
        onChange={handleAdresseChange}
        placeholder="Entrez l'adresse du client"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' },
        }}
      />

      <TextField
        label="Téléphone"
        variant="outlined"
        fullWidth
        margin="normal"
        value={telephoneClient}
        onChange={handleTelephoneChange}
        placeholder="Entrez le numéro de téléphone"
        InputLabelProps={{ shrink: true }}
        sx={{
          '& .MuiInputBase-root': { backgroundColor: '#f0f0f0' },
        }}
        inputProps={{ pattern: "[0-9]{10}" }} // Basic validation for phone number
      />
    </Box>
  );
});

export default ClientDetailsForm;
