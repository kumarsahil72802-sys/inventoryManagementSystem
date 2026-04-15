"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewDeadStock = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Identified":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Action Required":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Write-off":
        return { backgroundColor: "#f5f5f5", color: "#666" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Dead Stock ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.deadStockId}
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
          Category
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.category}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Last Movement
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.lastMovement}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Days in Stock
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.daysInStock}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Cost Price
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.costPrice?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Current Value
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.currentValue?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Depreciation
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.depreciation}%
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
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Reason
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.reason}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewDeadStock;
