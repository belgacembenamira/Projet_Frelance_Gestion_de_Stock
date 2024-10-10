import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Product } from "../types/Product";

interface OrderTableDevisProps {
    articlesPanier: Product[];
    quantitesPanier: Record<number, number>;
    remises: Record<number, number>;
    gererChangementRemise: (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    supprimerArticle: (id: number) => void;
    modifierArticle: (id: number, nouvelleQuantite: number) => void;
}

const OrderTableDevis: React.FC<OrderTableDevisProps> = ({
    articlesPanier,
    quantitesPanier,
    remises,
    gererChangementRemise,
    supprimerArticle,
    modifierArticle
}) => {
    const handleModifierArticle = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const nouvelleQuantite = parseInt(event.target.value, 10);
        modifierArticle(id, nouvelleQuantite);
    };

    const total = articlesPanier.reduce(
        (acc, article) => {
            const prixUnitaire = Number(article.price) || 0;
            const remise = remises[article.id] || 0;
            const quantite = quantitesPanier[article.id] || 0;
            return acc + (prixUnitaire * (1 - remise / 100) * quantite);
        },
        0
    );

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Réf.</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Quantité</TableCell>
                    <TableCell>Prix Unitaire</TableCell>
                    <TableCell>Remise (%)</TableCell>
                    <TableCell>Prix Après Remise</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {articlesPanier.map((article) => {
                    const prixUnitaire = Number(article.price) || 0;
                    const remise = remises[article.id] || 0;
                    const quantite = quantitesPanier[article.id] || 0;
                    const prixApresRemise = prixUnitaire * (1 - remise / 100);
                    const totalArticle = prixApresRemise * quantite;

                    return (
                        <TableRow key={article.id}>
                            <TableCell>{article.reference}</TableCell>
                            <TableCell>{article.description}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={quantite}
                                    onChange={handleModifierArticle(article.id)}
                                    inputProps={{ min: 0 }}
                                    variant="outlined"
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{prixUnitaire.toFixed(2)}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    value={remise}
                                    onChange={gererChangementRemise(article.id)}
                                    inputProps={{ min: 0, max: 100 }}
                                    variant="outlined"
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{prixApresRemise.toFixed(2)}</TableCell>
                            <TableCell>{totalArticle.toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => supprimerArticle(article.id)} size="small">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
                <TableRow>
                    <TableCell colSpan={7} align="right"><strong>Total</strong></TableCell>
                    <TableCell>{total.toFixed(2)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default OrderTableDevis;
