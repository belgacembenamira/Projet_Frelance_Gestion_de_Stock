import React, { useCallback } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Product } from "../types/Product";
import logo from "../../public/logo.png"; // Assurez-vous que ce chemin est correct pour votre logo
import { ProductModalProps } from "../types/ProductModalProps";

// Define the styles for the modal
const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  width: "90%", // Default width for responsiveness
  maxWidth: 600, // Max width to prevent it from getting too large on big screens
};

const ProductModal: React.FC<ProductModalProps> = React.memo(
  ({ isOpen, product, onClose, onChange, onSave }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    const handleSave = useCallback(() => {
      onSave();
    }, [onSave]);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event);
      },
      [onChange]
    );

    return (
      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ maxWidth: "150px", width: "100%" }}
            />
          </Box>
          <Typography variant="h6" component="h2" gutterBottom align="center">
            {product.id ? "Edit Product" : "Create Product"}
          </Typography>
          <TextField
            label="Reference"
            fullWidth
            name="reference"
            value={product.reference}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required // Indicate that this field is required
          />
          <TextField
            label="Description"
            fullWidth
            name="description"
            value={product.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Quantity"
            fullWidth
            name="quantity"
            type="number"
            value={product.quantity}
            onChange={handleChange}
            sx={{ mb: 2 }}
            inputProps={{ min: 0 }} // Ensure the value is non-negative
            required
          />
          <TextField
            label="Price"
            fullWidth
            name="price"
            value={product.price}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            label="Supplier Price"
            fullWidth
            name="supplierPrice"
            value={product.supplierPrice}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!product.reference || !product.description || product.quantity < 0 || !product.price || !product.supplierPrice} // Disable if any required field is empty
            >
              Save
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
);

export default ProductModal;
