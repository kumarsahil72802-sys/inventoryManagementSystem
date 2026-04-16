"use client";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { WarningOutlined } from "@mui/icons-material";

const DeleteBatch = ({ batchData, onClose, onDelete, loading = false }) => {
  if (!batchData) return null;

  return (
    <Box sx={{ textAlign: "center", py: 2 }}>
      <WarningOutlined sx={{ fontSize: 60, color: "#f44336", mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Delete Stock Batch
      </Typography>
      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Are you sure you want to delete batch <strong>{batchData.batchNumber}</strong> for <strong>{batchData.productName}</strong>? This action cannot be undone.
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={onDelete} variant="contained" color="error" sx={{ textTransform: "none" }} disabled={loading}>
          {loading ? <CircularProgress size={22} color="inherit" /> : "Delete Batch"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteBatch;
