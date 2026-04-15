"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewSalesReturn = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Approved":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Return ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.returnId}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Return Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.returnDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.customerName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.productName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Quantity
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.quantity}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Unit Price
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.unitPrice?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Return Amount
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.returnAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Reason
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.reason}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Status
        </Typography>
        <Chip
          label={viewData.status}
          size="small"
          sx={{
            ...getStatusColor(viewData.status),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.notes || 'No notes provided'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewSalesReturn;
