import React, { ChangeEvent } from "react";
import { TextField, Box, Typography } from "@mui/material";

interface ClientFormProps {
    nomClient: string;
    setNomClient: (value: string) => void;
    adresseClient: string;
    setAdresseClient: (value: string) => void;
    telephoneClient: string;
    setTelephoneClient: (value: string) => void;
}

const ClientForm: React.FC<ClientFormProps> = React.memo(
    ({ nomClient, setNomClient, adresseClient, setAdresseClient, telephoneClient, setTelephoneClient }) => {

        // Unified handler for all input fields
        const handleInputChange = (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
            setter(e.target.value);
        };

        return (
            <Box mb={3} p={2} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6" mb={2} color="primary">
                    Client Information
                </Typography>

                <TextField
                    label="Nom"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nomClient}
                    onChange={handleInputChange(setNomClient)}
                    helperText="Entrez le nom du client"
                />

                <TextField
                    label="Adresse"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={adresseClient}
                    onChange={handleInputChange(setAdresseClient)}
                    helperText="Entrez l'adresse complète"
                />

                <TextField
                    label="Téléphone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={telephoneClient}
                    onChange={handleInputChange(setTelephoneClient)}
                    helperText="Entrez le numéro de téléphone"
                />
            </Box>
        );
    }
);

export default ClientForm;
