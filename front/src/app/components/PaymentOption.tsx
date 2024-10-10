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
import { SelectChangeEvent } from "@mui/material/Select";

interface PaymentOptionProps {
    optionPaiement: string;
    setOptionPaiement: (value: string) => void;
    montantPartiel: number;
    setMontantPartiel: (value: number) => void;
}

const PaymentOption: React.FC<PaymentOptionProps> = React.memo(({
    optionPaiement,
    setOptionPaiement,
    montantPartiel,
    setMontantPartiel,
}) => {
    const handleOptionChange = (event: SelectChangeEvent<string>) => {
        const newOption = event.target.value;
        setOptionPaiement(newOption);
        
        // Reset montantPartiel when changing to "total"
        if (newOption === "total") {
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
                    onChange={handleOptionChange}
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
                    onChange={(e) => setMontantPartiel(Math.max(0, Number(e.target.value)))}
                    inputProps={{ min: 0 }} // Add a minimum value for the input
                />
            )}
        </Box>
    );
});

export default PaymentOption;
