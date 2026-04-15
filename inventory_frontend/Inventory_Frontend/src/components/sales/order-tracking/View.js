"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewOrderTracking = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "In Transit":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Processing":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Out for Delivery":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Tracking ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.trackingId}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Order ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.orderId}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Order Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.orderDate}
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
          Quantity Ordered
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.quantityOrdered}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Estimated Delivery
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.estimatedDelivery}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Warehouse
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.warehouse}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Current Status
        </Typography>
        <Chip
          label={viewData.currentStatus}
          size="small"
          sx={{
            ...getStatusColor(viewData.currentStatus),
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

export default ViewOrderTracking;
