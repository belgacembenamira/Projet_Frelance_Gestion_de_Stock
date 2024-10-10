import React, { useCallback } from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    IconButton,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Product } from "../types/Product";

interface OrderTableProps {

    articlesPanier: Product[];

    quantitesPanier: Record<number, number>;

    remises: Record<number, number>;

    onAddToCart: (product: Product, quantity: number) => void;

    onDiscountChange: (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => void;

    onQuantityChange: (id: number, nouvelleQuantite: number) => void;

    onRemove: (id: number) => void;

    supprimerArticle: (id: number) => void;

    modifierArticle: (id: number, nouvelleQuantite: number) => void;

}


const OrderTable: React.FC<OrderTableProps> = ({
    articlesPanier,
    quantitesPanier,
    remises,
    onDiscountChange, // Use the prop `onDiscountChange`
    onRemove,
    onQuantityChange,
}) => {

    const handleModifierArticle = useCallback(
        (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const nouvelleQuantite = parseInt(event.target.value, 10) || 0;
            onQuantityChange(id, nouvelleQuantite);
        },
        [onQuantityChange]
    );

    const total = articlesPanier.reduce((acc, article) => {
        const prixUnitaire = Number(article.price) || 0;
        const remise = remises[article.id] || 0;
        const quantite = quantitesPanier[article.id] || 0;
        const prixApresRemise = prixUnitaire * (1 - remise / 100);
        const totalArticle = prixApresRemise * quantite;
        return acc + totalArticle;
    }, 0);
    const handleDiscountChange = (articleId) => (event) => {
        const value = event.target.value;
        console.log(`Discount for article ${articleId}: ${value}`);
        // Add logic to handle the discount change
    };

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
                                    onChange={(event) => onDiscountChange(article.id)(event as React.ChangeEvent<HTMLInputElement>)} // Use the passed prop `onDiscountChange`
                                    slotProps={{ htmlInput: { min: 0, max: 100 } }} // restrict discount between 0 and 100
                                    variant="outlined"
                                    size="small"
                                />
                            </TableCell>
                            <TableCell>{prixApresRemise.toFixed(2)}</TableCell>
                            <TableCell>{totalArticle.toFixed(2)}</TableCell>
                            <TableCell>
                                <IconButton
                                    onClick={() => onRemove(article.id)}
                                    size="small"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    );
                })}
                <TableRow>
                    <TableCell colSpan={6} align="right">
                        <strong>Total</strong>
                    </TableCell>
                    <TableCell>{total.toFixed(2)}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default OrderTable;
