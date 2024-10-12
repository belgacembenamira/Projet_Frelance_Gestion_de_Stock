"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  TablePagination,
  InputAdornment,
  Skeleton,
  Snackbar,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Client } from "../types/Client";
import { useClients } from "../hooks/useClients";
import Sidebar from "../components/Sidebar/Sidebar";

// Extend jsPDF to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const Page = () => {
  const { deleteClient, updateClient, addClient, clients = [], loading } = useClients();
  const [clientForm, setClientForm] = useState<Client | null>(null);
  const [openDialog, setOpenDialog] = useState<'edit' | 'add' | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch clients when the component mounts or when a new client is added
  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, [clients]);

  const fetchClients = useCallback(async () => {
    // Fetch clients logic here
  }, []);

  const clientsTable = useMemo(() =>
    clients.filter(client =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [clients, searchTerm]
  );

  const totalAmountToPay = useMemo(() =>
    clientsTable.reduce((sum, client) => sum + parseFloat(client.totalAmountToPay?.toString() || "0"), 0),
    [clientsTable]
  );

  const totalAmountRemaining = useMemo(() =>
    clientsTable.reduce((sum, client) => {
      const amountPaid = parseFloat(client.amountPaid?.toString() || "0");
      return sum + (parseFloat(client.totalAmountToPay?.toString() || "0") - amountPaid);
    }, 0),
    [clientsTable]
  );

  const handleDelete = useCallback(async (id: number) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cela supprimera définitivement le client.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimez-le !",
      cancelButtonText: "Non, annuler",
    });
    if (result.isConfirmed) {
      await deleteClient(id);
      Swal.fire("Supprimé !", "Le client a été supprimé.", "success");
    }
  }, [deleteClient]);

  const handleOpenDialog = useCallback((client: Client | null, mode: 'edit' | 'add') => {
    setClientForm(client ? { ...client } : { id: 0, name: "", address: "", phone: "", totalAmountToPay: 0, amountPaid: 0 });
    setOpenDialog(mode);
  }, []);

  const handleSaveClient = useCallback(async () => {
    if (clientForm) {
      try {
        if (openDialog === 'edit' && clientForm.id !== undefined) {
          await updateClient({ id: clientForm.id, data: clientForm });
          setNotification("Client mis à jour avec succès!");
        } else {
          await addClient(clientForm);
          setNotification("Client ajouté avec succès!");
        }
      } catch (error) {
        setNotification("Une erreur est survenue. Veuillez réessayer.");
      } finally {
        setOpenDialog(null);
        setClientForm(null);
      }
    }
  }, [clientForm, openDialog, updateClient, addClient]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setClientForm(prev => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleChangePage = useCallback((event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const generatePDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Table des Clients", 14, 16);
    doc.autoTable({
      head: [["ID", "Nom", "Adresse", "Téléphone", "Total à payer", "Montant payé", "Reste à payer"]],
      body: clientsTable.map(client => {
        const amountPaid = parseFloat(client.amountPaid?.toString() || "0");
        const remainingAmount = parseFloat(client.totalAmountToPay?.toString() || "0") - amountPaid;
        return [
          client.id,
          client.name,
          client.address,
          client.phone,
          client.totalAmountToPay,
          amountPaid,
          remainingAmount,
        ];
      }),
      startY: 22,
    });
    doc.save("clients.pdf");
  }, [clientsTable]);

  return (

    <>
      <Sidebar />
      <Box sx={{ padding: 2, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h6" gutterBottom>Statistiques</Typography>
        {loading ? (
          <Skeleton width={200} height={30} />
        ) : (
          <>
            <Typography variant="body1">Total à payer : {totalAmountToPay.toFixed(2)} TND</Typography>
            <Typography variant="body1">Total restant à payer : {totalAmountRemaining.toFixed(2)} TND</Typography>
            <Typography variant="body1">Nombre de clients : {clientsTable.length}</Typography>
          </>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 2 }}>
        <TextField
          label="Rechercher un client"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box>
          <IconButton color="primary" onClick={generatePDF}><PrintIcon /></IconButton>
          <IconButton color="primary" onClick={() => handleOpenDialog(null, 'add')}><AddIcon /></IconButton>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Adresse</TableCell>
              <TableCell>Téléphone</TableCell>
              <TableCell>Total à payer</TableCell>
              <TableCell>Montant payé</TableCell>
              <TableCell>Reste à payer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientsTable.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(client => (
              <TableRow key={client.id}>
                <TableCell>{client.id}</TableCell>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client.phone}</TableCell>
                <TableCell>{client.totalAmountToPay || "0.00"}</TableCell>
                <TableCell>{client.amountPaid || "0.00"}</TableCell>
                <TableCell>{((client.totalAmountToPay ?? 0) - (client.amountPaid ?? 0)).toFixed(2)}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpenDialog(client, 'edit')}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => client.id !== undefined && handleDelete(client.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[15, 30, 50]}
        component="div"
        count={clientsTable.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog open={Boolean(openDialog)} onClose={() => setOpenDialog(null)}>
        <DialogTitle>{openDialog === 'edit' ? 'Modifier le Client' : 'Ajouter un Client'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            name="name"
            value={clientForm?.name || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Adresse"
            type="text"
            fullWidth
            name="address"
            value={clientForm?.address || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Téléphone"
            type="text"
            fullWidth
            name="phone"
            value={clientForm?.phone || ''}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Total à payer"
            type="number"
            fullWidth
            name="totalAmountToPay"
            value={clientForm?.totalAmountToPay || 0}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Montant payé"
            type="number"
            fullWidth
            name="amountPaid"
            value={clientForm?.amountPaid || 0}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(null)}>Annuler</Button>
          <Button onClick={handleSaveClient}>Enregistrer</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        message={notification}
      />
    </>
  );
};

export default Page;
