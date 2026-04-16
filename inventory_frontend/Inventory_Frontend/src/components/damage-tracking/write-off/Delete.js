"use client";
import React from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";

const DeleteWriteOff = ({ writeOffData, onClose, onDelete }) => {
  if (!writeOffData) return null;

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <WarningIcon sx={{ fontSize: 48, color: '#f44336', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 500 }}>
        Confirm Delete
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Are you sure you want to delete write-off record <strong>{writeOffData.writeOffNumber}</strong> for product <strong>{writeOffData.productName}</strong>?
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'error.main' }}>
        This action cannot be undone.
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
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
      </Box>
    </Box>
  );
};

export default DeleteWriteOff;
