import React, { useCallback, memo } from "react";
import {
    TableCell,
    TableRow,
    IconButton,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Commande } from "../types/Commande";
import { genererPDF } from "../utils/genererPDF";

interface CommandeRowProps {
    commande: Commande;
    printType: string;
    setPrintType: (value: DocumentType) => void;
    handleEdit: (commande: Commande) => void;
    handleDelete: (id: number) => void;
    handleViewDetails: (commande: Commande) => void;
    afficherRemisesTableau: boolean; // Pour contrôler l'affichage des remises
    afficherPaiementInfo: boolean; // Pour contrôler l'affichage des informations de paiement
}

const CommandeRow: React.FC<CommandeRowProps> = memo(
    ({
        commande,
        printType,
        setPrintType,
        handleEdit,
        handleDelete,
        handleViewDetails,
        afficherRemisesTableau,
        afficherPaiementInfo,
    }) => {
        const onEdit = useCallback(
            () => handleEdit(commande),
            [commande, handleEdit]
        );
        const onDelete = useCallback(
            () => handleDelete(commande.id!),
            [commande.id, handleDelete]
        );
        const onViewDetails = useCallback(
            () => handleViewDetails(commande),
            [commande, handleViewDetails]
        );
        const onPrint = useCallback(
            () => {
                genererPDF(
                    commande as Commande,
                    printType as DocumentType,
                    afficherRemisesTableau,
                    afficherPaiementInfo
                );
            },
            [commande, printType, afficherRemisesTableau, afficherPaiementInfo]
        );

        return (
            <TableRow key={commande.id}>
                <TableCell>{commande.id}</TableCell>
                <TableCell>{commande.client?.name || "N/A"}</TableCell>
                <TableCell>{new Date(commande.date).toLocaleDateString()}</TableCell>

                {/* Affichage de la colonne Remise si activée */}
                {afficherRemisesTableau && (
                    <TableCell>
                        {commande.remise ? `${commande.remise} €` : "Aucune remise"}
                    </TableCell>
                )}

                {/* Ajout d'une colonne pour les informations de paiement si activée */}
                {afficherPaiementInfo && (
                    <TableCell>
                        {/* Affichage des informations de paiement (par exemple, montant payé, montant restant) */}
                        <div>
                            <div>Montant total payé: {commande.totalAmountPaid} €</div>
                            <div>Montant restant: {commande.amountRemaining || "0"} €</div>
                        </div>
                    </TableCell>
                )}

                <TableCell>
                    <Box display="flex" alignItems="center">
                        <Tooltip title="Modifier" aria-label="edit">
                            <IconButton onClick={onEdit}>
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer" aria-label="delete">
                            <IconButton onClick={onDelete}>
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Détails" aria-label="view details">
                            <IconButton onClick={onViewDetails}>
                                <VisibilityIcon />
                            </IconButton>
                        </Tooltip>
                        <FormControl sx={{ mx: 1, minWidth: 120 }} size="small">
                            <InputLabel>Type d'impression</InputLabel>
                            <Select
                                value={printType}
                                onChange={(e) => setPrintType(e.target.value)}
                                label="Type d'impression"
                            >
                                <MenuItem value="invoice">Facture</MenuItem>
                                <MenuItem value="deliveryNote">Bon de Livraison</MenuItem>
                            </Select>
                        </FormControl>
                        <Tooltip title="Imprimer" aria-label="print">
                            <IconButton onClick={onPrint}>
                                <PrintIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>
        );
    }
);

export default CommandeRow;
