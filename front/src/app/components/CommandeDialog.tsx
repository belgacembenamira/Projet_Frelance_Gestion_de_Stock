"use client";
import React, { FC, useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Box,
} from '@mui/material';
import Swal from 'sweetalert2';
import { updateCommande } from '../services/commandeApi';
import { Commande } from '../types/Commande';


interface CommandeDialogProps {
    open: boolean;
    onClose: () => void;
    formData: Commande | null;
}

const CommandeDialog: FC<CommandeDialogProps> = React.memo(({ open, onClose, formData }) => {
    const [formState, setFormState] = useState({
        clientName: '',
        date: '',
        amountBeforeDiscount: undefined as number | undefined,
    });

    useEffect(() => {
        if (formData) {
            setFormState({
                clientName: formData.client?.name || '',
                date: formData.date || '',
                amountBeforeDiscount: formData.amountBeforeDiscount,
            });
        }
    }, [formData]);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setFormState((prevState) => ({
                ...prevState,
                [name]: name === "amountBeforeDiscount" ? parseFloat(value) : value,
            }));
        },
        []
    );

    const handleSave = async () => {
        const { clientName, date, amountBeforeDiscount } = formState;

        if (!clientName || !date || amountBeforeDiscount === undefined) {
            Swal.fire("Error", "Please fill in all required fields.", "error");
            return;
        }

        if (formData?.id !== undefined && formData.id !== null) {
            await updateCommande(formData.id, {
                ...formData,
                client: { ...formData.client, name: clientName },
                date,
                amountBeforeDiscount,
            });
            onClose();
        } else {
            Swal.fire("Error", "Invalid Commande ID.", "error");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ backgroundColor: '#f5f5f5', padding: '16px 24px' }}>
                Edit Commande
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Client Name"
                        name="clientName"
                        type="text"
                        fullWidth
                        value={formState.clientName}
                        onChange={handleInputChange}
                        helperText="Please enter the client's name"
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        name="date"
                        type="date"
                        fullWidth
                        value={formState.date}
                        onChange={handleInputChange}
                        helperText="Select the order date"
                    />
                    <TextField
                        margin="dense"
                        label="Amount Before Discount"
                        name="amountBeforeDiscount"
                        type="number"
                        fullWidth
                        value={formState.amountBeforeDiscount !== undefined ? formState.amountBeforeDiscount : ''}
                        onChange={handleInputChange}
                        helperText="Enter the total amount before discount"
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: '16px 24px' }}>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
});

export default CommandeDialog;
