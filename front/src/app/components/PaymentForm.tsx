import React from "react";
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";

interface PaymentFormProps {
    optionPaiement: string;
    setOptionPaiement: (value: string) => void;
    montantPartiel: number;
    setMontantPartiel: (value: number) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = React.memo(({
    optionPaiement,
    setOptionPaiement,
    montantPartiel,
    setMontantPartiel,
}) => {
    const handlePaymentOptionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setOptionPaiement(event.target.value as string);
        // Reset montantPartiel if the payment option changes to total
        if (event.target.value === "total") {
            setMontantPartiel(0);
        }
    };

    return (
        <Box mb={3}>
            <Typography variant="h6">Choix du Paiement</Typography>
            <FormControl fullWidth variant="outlined">
                <InputLabel id="payment-option-label">Option de Paiement</InputLabel>
                <Select
                    labelId="payment-option-label"
                    value={optionPaiement}
                    onChange={handlePaymentOptionChange}
                    label="Option de Paiement"
                >
                    <MenuItem value="total">Total</MenuItem>
                    <MenuItem value="partiel">Partiel</MenuItem>
                </Select>
            </FormControl>
            {optionPaiement === "partiel" && (
                <TextField
                    label="Montant Partiel"
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={montantPartiel}
                    onChange={(e) => setMontantPartiel(Number(e.target.value))}
                    inputProps={{ min: 0 }} // Add a minimum value for the input
                />
            )}
        </Box>
    );
});

export default PaymentForm;
