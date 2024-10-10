import React from "react";
import {
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Table,
} from "@mui/material";
import { ChangeEvent } from "react";
import { Product } from "../types/Product";

interface ProductTableProps {
  articlesPanier: Product[];
  quantitesPanier: Record<number, number>;
  remises: Record<number, number>;
  gererChangementRemise: (
    id: number
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProductTab: React.FC<ProductTableProps> = React.memo(
  ({
    articlesPanier,
    quantitesPanier,
    remises,
    gererChangementRemise,
  }) => {
    return (
      <TableContainer component={Paper}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {articlesPanier.map((article) => {
              const quantity = quantitesPanier[article.id] || 0;
              const discount = remises[article.id] || 0;
              const priceAfterDiscount = Number(article.price) * (1 - discount / 100);
              const totalPrice = priceAfterDiscount * quantity;

              return (
                <TableRow key={article.id}>
                  <TableCell>{article.id}</TableCell>
                  <TableCell>{article.description}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>{article.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={discount}
                      onChange={gererChangementRemise(article.id)}
                      inputProps={{ min: 0, max: 100 }}
                      variant="outlined"
                      size="small"
                      sx={{ width: "80px" }} // Fixed width for the input field
                    />
                  </TableCell>
                  <TableCell>{priceAfterDiscount.toFixed(2)}</TableCell>
                  <TableCell>{totalPrice.toFixed(2)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
);
