"use client";
import React, { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
} from "@mui/material";
import { Delete, Visibility } from "@mui/icons-material";
import { CommandeFournisseur } from "../types/CommandeFournisseur";
import {
    getAllCommandeFournisseur,
    deleteCommandeFournisseur,
    getCommandeFournisseurById,
} from "../services/commandeFournisseurApi";
import { ProductCommande } from "../types/ProductCommande";

const CommandeFournisseurList: React.FC = () => {
    const [commandes, setCommandes] = useState<CommandeFournisseur[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchCommandes = async () => {
            const data = await getAllCommandeFournisseur();
            setCommandes(data);
        };
        fetchCommandes();
    }, []);

    // Filter commandes based on product description
    const handleSearch = (): CommandeFournisseur[] => {
        return commandes.filter((commande) =>
            (commande.products as ProductCommande[]).some((product: ProductCommande) =>
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    };

    // Delete specific commande
    const handleDelete = async (id: number) => {
        await deleteCommandeFournisseur(id);
        setCommandes((prev) => prev.filter((commande) => commande.id !== id));
    };

    // View specific commande
    const handleView = async (id: number) => {
        const commande = await getCommandeFournisseurById(id);
        console.log(commande); // You can replace this with your modal or other view logic.
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Liste des Commandes Fournisseurs
            </Typography>
            <TextField
                label="Rechercher par description de produit"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
                sx={{ marginBottom: 3 }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Description du produit</b></TableCell>
                            <TableCell><b>Référence</b></TableCell>
                            <TableCell><b>Total</b></TableCell>
                            <TableCell><b>Montant après remise</b></TableCell>
                            <TableCell><b>Montant restant</b></TableCell>
                            <TableCell><b>Fournisseur</b></TableCell>
                            <TableCell><b>Actions</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {handleSearch().map((commande: CommandeFournisseur) => (
                            <TableRow key={commande.id}>
                                <TableCell>
                                    {commande.products.map((product: ProductCommande, index) => (
                                        <div key={index}>
                                        <Typography variant="body2">{product.description}</Typography>
                                    </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {commande.products.map((product: ProductCommande, index: number) => (
                                        <div key={index}>
                                            <Typography variant="body2">{product.reference}</Typography>
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{commande.totalAmount}</TableCell>
                                <TableCell>{commande.amountAfterDiscount}</TableCell>
                                <TableCell>{commande.amountRemaining}</TableCell>
                                <TableCell>{commande.supplier?.name}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleView(commande.id)}>
                                        <Visibility />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(commande.id)}>
                                        <Delete color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Container >
    );
};

export default CommandeFournisseurList;
