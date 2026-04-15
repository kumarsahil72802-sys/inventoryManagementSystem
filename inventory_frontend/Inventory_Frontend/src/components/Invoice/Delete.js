"use client";
import React from "react";
import { Typography, Box } from "@mui/material";

const DeleteInvoice = ({ deleteData, handleDelete, handleClose }) => {
  if (!deleteData) return null;

  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        Delete Invoice
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Are you sure you want to delete invoice <strong>{deleteData.invoiceNumber}</strong> for <strong>{deleteData.customerName}</strong>?
      </Typography>
    </Box>
  );
};

export default DeleteInvoice;
