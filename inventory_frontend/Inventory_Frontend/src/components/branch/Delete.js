"use client";
import { Button, Grid, Typography } from "@mui/material";

const DeleteBranch = ({ branchData, onClose, onDelete, saving }) => {
  if (!branchData) return null;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body1">
          Are you sure you want to delete branch <strong>{branchData.branchName}</strong> ({branchData.branchCode})?
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          This action cannot be undone.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          disabled={saving}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onDelete} 
          variant="contained" 
          color="error"
          disabled={saving}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          {saving ? "Deleting..." : "Delete"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteBranch;