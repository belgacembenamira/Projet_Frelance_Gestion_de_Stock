import React, { memo } from "react";
import { TableRow, TableCell, Button, Box } from "@mui/material";
import { Devis } from "../types/Devis";

interface DevisRowProps {
    devis: Devis; // Corrected casing for 'Devis' to 'devis'
    handleEdit: (devis: Devis) => void;
    handleDelete: (id: number) => void;
    handleViewDetails: (devis: Devis) => void;
    handleTransformToCommande: (id: number) => void;
    printType: string;
    setPrintType: (type: string) => void;
}

const DevisRow: React.FC<DevisRowProps> = memo(({
    devis, // Corrected casing for 'Devis' to 'devis'
    handleEdit,
    handleDelete,
    handleViewDetails,
    handleTransformToCommande,
}) => {
    return (
        <TableRow>
            <TableCell>{devis.id}</TableCell>
            <TableCell>{devis.client?.name || "N/A"}</TableCell>
            <TableCell>{new Date(devis.date).toLocaleDateString()}</TableCell>
            <TableCell>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" onClick={() => handleViewDetails(devis)}>Détails</Button>
                    <Button variant="outlined" onClick={() => handleEdit(devis)}>Éditer</Button>
                    {devis.id !== undefined && (
                        <>
                            <Button variant="outlined" color="error" onClick={() => handleDelete(devis.id)}>Supprimer</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleTransformToCommande(devis.id)}
                            >
                                Transformer en Commande
                            </Button>
                        </>
                    )}
                </Box>
            </TableCell>
        </TableRow>
    );
});

export default DevisRow;
