"use client";
import { Button, Grid, Typography, CircularProgress } from "@mui/material";

const DeleteStockTransfer = ({ transferData, onClose, onDelete, loading = false }) => {
  if (!transferData) return null;
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          Are you sure you want to delete transfer <strong>{transferData.transferId}</strong> from <strong>{transferData.fromWarehouse}</strong> to <strong>{transferData.toWarehouse}</strong>? This action cannot be undone.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }} disabled={loading}>Cancel</Button>
        <Button onClick={onDelete} variant="contained" color="error" sx={{ textTransform: 'none' }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Delete'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteStockTransfer;
