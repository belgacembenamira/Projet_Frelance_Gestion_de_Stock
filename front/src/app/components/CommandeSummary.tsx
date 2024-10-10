import React, { memo } from 'react';
import { Box, Typography, Button, Tooltip } from "@mui/material";

interface CommandeSummaryProps {
  montantTotalAvantRemise: number;
  montantTotal: number;
  onConfirm: () => void;
}

const CommandeSummary: React.FC<CommandeSummaryProps> = memo(({
  montantTotalAvantRemise,
  montantTotal,
  onConfirm,
}) => {
  // Function for formatting currency with localization
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);

  return (
    <Box mt={3} sx={{ textAlign: 'center', borderRadius: 1, boxShadow: 3, p: 3, backgroundColor: '#f9f9f9' }}>
      <Typography variant="h6" gutterBottom>Résumé de la Commande</Typography>
      <Typography>
        Total avant Remise: {formatCurrency(montantTotalAvantRemise)}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Total après Remise: {formatCurrency(montantTotal)}
      </Typography>
      <Tooltip title="Confirmer la commande" placement="top">
        <Button
          variant="contained"
          color="primary"
          onClick={onConfirm}
          aria-label="confirmer la commande"
          sx={{ paddingX: 3, paddingY: 1.5 }}
        >
          Confirmer la Commande
        </Button>
      </Tooltip>
    </Box>
  );
});

export default CommandeSummary;
