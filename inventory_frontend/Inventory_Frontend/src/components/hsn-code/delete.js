"use client";
import { Button, Grid, Typography } from "@mui/material";

const DeleteHSN = ({ hsnData, onClose, onDelete }) => {
  if (!hsnData) return null;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          Are you sure you want to delete HSN/SAC Code <strong>{hsnData.hsnCode}</strong>?
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onDelete} 
          variant="contained" 
          color="error"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteHSN;
