import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

// Définition des interfaces pour les produits et les commandes
interface Product {
  reference: number;
  description: string;
  quantity: number;
  unitPrice: string;
  discount: number;
  priceAfterDiscount: string;
  totalPrice: string;
}

interface Order {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  paymentOption: string;
  partialAmount: number;
  totalAmountBeforeDiscount: string;
  totalAmount: string;
  date?: string;
  products?: Product[];
}

// Clé pour le stockage local
const LOCAL_STORAGE_KEY = "customerInfo";

const fetchDataFromLocalStorage = (): Order[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    const parsedData = data ? JSON.parse(data) : [];
    return Array.isArray(parsedData) ? parsedData : [];
  } catch (error) {
    console.error("Erreur lors de l'analyse des données du stockage local", error);
    return [];
  }
};

const page: React.FC = () => {
  const [rows, setRows] = useState<Order[]>(fetchDataFromLocalStorage());
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<Order>({
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    paymentOption: "partial",
    partialAmount: 0,
    totalAmountBeforeDiscount: "",
    totalAmount: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    saveDataToLocalStorage(rows);
  }, [rows]);

  const handleClickOpen = useCallback((index: number | null = null) => {
    setEditIndex(index);
    setFormData(
      index !== null
        ? rows[index]
        : {
          customerName: "",
          customerAddress: "",
          customerPhone: "",
          paymentOption: "partial",
          partialAmount: 0,
          totalAmountBeforeDiscount: "",
          totalAmount: "",
        }
    );
    setOpen(true);
  }, [rows]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = useCallback(() => {
    if (!formData.customerName || !formData.customerAddress || !formData.customerPhone || formData.partialAmount < 0 || !formData.totalAmountBeforeDiscount || !formData.totalAmount) {
      setSnackbarMessage("Veuillez remplir tous les champs correctement.");
      setSnackbarOpen(true);
      return;
    }

    const newRows = [...rows];
    if (editIndex !== null) {
      newRows[editIndex] = formData;
    } else {
      newRows.push(formData);
    }
    setRows(newRows);
    handleClose();
  }, [formData, rows, editIndex]);

  const handleDelete = useCallback((index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  }, [rows]);

  const saveDataToLocalStorage = (data: Order[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde dans le stockage local", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
        sx={{ marginBottom: 2 }}
      >
        Ajouter
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom du client</TableCell>
              <TableCell>Adresse du client</TableCell>
              <TableCell>Téléphone du client</TableCell>
              <TableCell>Option de paiement</TableCell>
              <TableCell>Montant partiel</TableCell>
              <TableCell>Montant total avant remise</TableCell>
              <TableCell>Montant total</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(rows) &&
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.customerName}</TableCell>
                  <TableCell>{row.customerAddress}</TableCell>
                  <TableCell>{row.customerPhone}</TableCell>
                  <TableCell>{row.paymentOption}</TableCell>
                  <TableCell>{row.partialAmount}</TableCell>
                  <TableCell>{row.totalAmountBeforeDiscount}</TableCell>
                  <TableCell>{row.totalAmount}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(index)}
                      sx={{ marginRight: 1 }}
                    >
                      Modifier
                    </Button>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex !== null ? "Modifier" : "Ajouter"} l'entrée</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom du client"
            fullWidth
            variant="outlined"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Adresse du client"
            fullWidth
            variant="outlined"
            value={formData.customerAddress}
            onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Téléphone du client"
            fullWidth
            variant="outlined"
            value={formData.customerPhone}
            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Option de paiement"
            fullWidth
            variant="outlined"
            value={formData.paymentOption}
            onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Montant partiel"
            fullWidth
            variant="outlined"
            type="number"
            value={formData.partialAmount}
            onChange={(e) => setFormData({ ...formData, partialAmount: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Montant total avant remise"
            fullWidth
            variant="outlined"
            value={formData.totalAmountBeforeDiscount}
            onChange={(e) => setFormData({ ...formData, totalAmountBeforeDiscount: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Montant total"
            fullWidth
            variant="outlined"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for alerts */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default page;
