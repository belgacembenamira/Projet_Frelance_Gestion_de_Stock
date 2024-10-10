"use client";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
} from "@mui/material";
import { Product } from "../types/Product";
import { getAllProducts } from "../services/ProductService";
import jsPDF from "jspdf";
import Swal from "sweetalert2";
import logo from "../public/logo.png";

const Page: React.FC = () => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [paymentOption, setPaymentOption] = useState<string>("total");

  // Charger les produits du panier lors du montage du composant
  useEffect(() => {
    const loadCart = async () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      const products = await getAllProducts();
      const selectedProducts = products.filter((product) => cart[product.id]);
      setCartItems(selectedProducts);
      setCartQuantities(cart);
    };
    loadCart();
  }, []);

  // Gérer la confirmation de la commande
  const handleConfirmOrder = useCallback(() => {
    if (!customerName || !customerAddress || !customerPhone) {
      Swal.fire("Erreur", "Veuillez renseigner toutes les informations client", "error");
      return;
    }

    Swal.fire({
      title: "Confirmer la commande ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, confirmer",
    }).then((result) => {
      if (result.isConfirmed) {
        // Supprimer les éléments du panier
        localStorage.removeItem("cart");
        Swal.fire("Commande Confirmée", "Votre commande a bien été enregistrée.", "success");

        // Générer le PDF de la commande
        const doc = new jsPDF();
        doc.addImage(logo, "PNG", 20, 10, 50, 30); // Ajouter le logo
        doc.text("Bon de Commande", 20, 50);
        doc.text(`Client: ${customerName}`, 20, 60);
        doc.text(`Adresse: ${customerAddress}`, 20, 70);
        doc.text(`Téléphone: ${customerPhone}`, 20, 80);
        doc.text("Détails de la commande :", 20, 90);
        cartItems.forEach((item, index) => {
          doc.text(
            `${item.description} - Quantité: ${cartQuantities[item.id]} - Prix: ${Number(item.price ?? 0) * cartQuantities[item.id]}€`,
            20,
            100 + index * 10
          );
        });
        doc.save(`Commande_${customerName}.pdf`);
      }
    });
  }, [cartItems, cartQuantities, customerName, customerAddress, customerPhone]);

  // Gérer les changements dans les champs de texte
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (event: ChangeEvent<HTMLInputElement>) => {
    setter(event.target.value);
  };

  // Gérer le changement d'option de paiement
  const handlePaymentChange = (event: SelectChangeEvent<string>) => {
    setPaymentOption(event.target.value as string);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Commande</Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Nom du Client"
          value={customerName}
          onChange={handleInputChange(setCustomerName)}
          required
        />
        <TextField
          fullWidth
          label="Adresse du Client"
          value={customerAddress}
          onChange={handleInputChange(setCustomerAddress)}
          required
        />
        <TextField
          fullWidth
          label="Téléphone du Client"
          value={customerPhone}
          onChange={handleInputChange(setCustomerPhone)}
          required
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="payment-option-label">Mode de Paiement</InputLabel>
        <Select
          labelId="payment-option-label"
          value={paymentOption}
          onChange={handlePaymentChange}
        >
          <MenuItem value="total">Total</MenuItem>
          <MenuItem value="partiel">Partiel</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="h6">Produits du Panier</Typography>
      <List>
        {cartItems.map((item) => (
          <ListItem key={item.id}>
            <ListItemText
              primary={`${item.description} - Prix: ${item.price}€`}
              secondary={`Quantité: ${cartQuantities[item.id]}`}
            />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="primary" onClick={handleConfirmOrder}>
        Confirmer la Commande
      </Button>
    </Container>
  );
};

export default Page;
