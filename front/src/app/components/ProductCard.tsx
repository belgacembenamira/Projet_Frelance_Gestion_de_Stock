import React, { useState, useCallback, ChangeEvent, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Product } from "../types/Product";

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product, quantity: number) => void;
  onSetQuantity: (product: Product, quantity: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = React.memo(({
  product,
  cartQuantity,
  onAddToCart,
  onSetQuantity,
}) => {
  const [quantity, setQuantity] = useState<number>(cartQuantity);

  // Synchronize local quantity state with cartQuantity prop
  useEffect(() => {
    setQuantity(cartQuantity);
  }, [cartQuantity]);

  const handleAddClick = useCallback(() => {
    if (product.quantity !== null && quantity < product.quantity!) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onSetQuantity(product, newQuantity);
    }
  }, [quantity, product, onSetQuantity]);

  const handleRemoveClick = useCallback(() => {
    if (quantity > 0) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onSetQuantity(product, newQuantity);
    }
  }, [quantity, product, onSetQuantity]);

  const handleQuantityChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const newQuantity = Math.max(0, Math.min(Number(value) || 0, product.quantity ?? 0));
      setQuantity(newQuantity);
      onSetQuantity(product, newQuantity);
    },
    [product.quantity, onSetQuantity, product]
  );

  return (
    <Card
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: 3,
        transition: "transform 0.2s",
        '&:hover': {
          transform: "scale(1.02)",
        }
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: "#1976d2", fontWeight: 600, mb: 1 }}>
          {product.description}
        </Typography>
        <Typography variant="body1" sx={{ color: "#4a4a4a", mb: 1 }}>
          Prix: {product.price}TND
        </Typography>
        <Typography variant="body2" sx={{ color: "#4a4a4a", mb: 2 }}>
          Quantité disponible: {product.quantity}
        </Typography>

        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <IconButton
              onClick={handleRemoveClick}
              disabled={quantity === 0}
              size="medium"
              sx={{ color: quantity === 0 ? "#c0c0c0" : "#1976d2" }}
            >
              <RemoveIcon />
            </IconButton>
          </Grid>

          <Grid item>
            <TextField
              type="number"
              inputProps={{
                min: 0,
                max: product.quantity,
                style: {
                  textAlign: "center",
                  fontSize: "18px",
                  padding: "10px",
                },
              }}
              value={quantity}
              onChange={handleQuantityChange}
              sx={{
                width: "100px",
                mb: 2,
              }}
            />
          </Grid>

          <Grid item>
            <IconButton
              onClick={handleAddClick}
              size="small"
              color="primary"
              disabled={quantity >= (product.quantity ?? 0)}
            >
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>

        <Button
          onClick={() => onAddToCart(product, quantity)}
          disabled={quantity === 0}
          variant="contained"
          sx={{
            mt: 2,
            bgcolor: quantity === 0 ? "#cfcfcf" : "#1976d2",
            color: "#ffffff",
            fontWeight: "bold",
            width: "100%",
            padding: "10px",
            textTransform: "none",
            '&:hover': {
              bgcolor: quantity === 0 ? "#cfcfcf" : "#1565c0",
            }
          }}
          disableElevation
        >
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
});

export default ProductCard;
