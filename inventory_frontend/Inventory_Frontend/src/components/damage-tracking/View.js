"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewDamage = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
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
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.productName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Damage Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damageDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Damage Type
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damageType}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Damaged Quantity
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damagedQuantity}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Unit Cost
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.unitCost?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Total Loss
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalLoss?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Reported By
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.reportedBy}
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
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Warehouse
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.warehouse}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.notes || 'No notes available'}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewDamage;