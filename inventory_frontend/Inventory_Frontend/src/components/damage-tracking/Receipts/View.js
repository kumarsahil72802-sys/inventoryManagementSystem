"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewReceipt = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Submitted":
      case "Under Review":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Draft":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Receipt Number
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.receiptNumber}
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
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.productName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Warehouse
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.warehouseName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Receipt Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.receiptDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Total Value
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalValue?.toLocaleString()}
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
          Received By
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.receivedBy}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Related Damage ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damageId?.damageId || viewData.damageId}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Damage Description
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damageDescription}
        </Typography>
      </Grid>
      {viewData.notes && (
        <Grid size={12}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Notes
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.notes}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ViewReceipt;
