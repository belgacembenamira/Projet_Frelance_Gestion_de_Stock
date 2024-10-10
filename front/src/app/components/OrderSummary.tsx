import React from "react";
import { Box, Typography } from "@mui/material";

interface OrderSummaryProps {
    montantTotalAvantRemise: number;
    montantTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = React.memo(
    ({ montantTotalAvantRemise, montantTotal }) => {
        return (
            <Box mt={3} p={2} border={1} borderColor="grey.300" borderRadius={2}>
                <Typography variant="h6" gutterBottom>
                    Résumé de la Commande
                </Typography>
                <Typography>
                    <strong>Total avant Remise:</strong> {montantTotalAvantRemise.toFixed(2)}TND
                </Typography>
                <Typography>
                    <strong>Total après Remise:</strong> {montantTotal.toFixed(2)}TND
                </Typography>
            </Box>
        );
    }
);

export default OrderSummary;
