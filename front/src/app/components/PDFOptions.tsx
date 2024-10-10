import React from "react";
import { Checkbox, FormControlLabel, Switch, Box, Typography } from "@mui/material";

interface PDFOptionsProps {
    afficherRemises: boolean;
    setAfficherRemises: (value: boolean) => void;
    afficherRemisesTableau: boolean;
    setAfficherRemisesTableau: (value: boolean) => void;
}

const PDFOptions: React.FC<PDFOptionsProps> = React.memo(({
    afficherRemises,
    setAfficherRemises,
    afficherRemisesTableau,
    setAfficherRemisesTableau
}) => {
    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>
                Options PDF
            </Typography>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={afficherRemises}
                        onChange={(e) => setAfficherRemises(e.target.checked)}
                    />
                }
                label="Afficher les remises sur le PDF"
            />
            <FormControlLabel
                control={
                    <Switch
                        checked={afficherRemisesTableau}
                        onChange={(e) => setAfficherRemisesTableau(e.target.checked)}
                        color="primary"
                    />
                }
                label="Afficher la remise dans le tableau de paiement"
            />
        </Box>
    );
});

export default PDFOptions;
