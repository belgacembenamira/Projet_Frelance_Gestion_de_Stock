import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from "@mui/material";
import { Product } from "../types/Product";
import { getAllProducts } from "../services/ProductService";

interface AddProductDialogProps {
    open: boolean;
    onClose: () => void;
    onAddProduct: (product: Product, quantity: number, discount?: number) => void;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onClose, onAddProduct }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [discount, setDiscount] = useState<number>(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getAllProducts();
                setProducts(products);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, []);

    const handleAddProduct = () => {
        if (selectedProduct) {
            onAddProduct(selectedProduct, quantity, discount);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Ajouter Produit</DialogTitle>
            <DialogContent>
                <TextField
                    select
                    label="Produit"
                    value={selectedProduct?.id || ""}
                    onChange={(e) => {
                        const product = products.find(p => p.id === Number(e.target.value));
                        setSelectedProduct(product || null);
                    }}
                    fullWidth
                    margin="normal"
                >
                    {products.map((product) => (
                        <MenuItem key={product.id} value={product.id}>
                            {product.description}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Quantité"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Remise (%)"
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fermer</Button>
                <Button onClick={handleAddProduct} color="primary">Ajouter</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductDialog;