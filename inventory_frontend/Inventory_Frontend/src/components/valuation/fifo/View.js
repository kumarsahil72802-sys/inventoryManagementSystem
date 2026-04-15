"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewFIFO = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getMethodColor = (method) => {
    switch (method) {
      case "FIFO":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "LIFO":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Weighted Average":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Valuation ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.valuationId}
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
          Method
        </Typography>
        <Chip
          label={viewData.method}
          size="small"
          sx={{
            ...getMethodColor(viewData.method),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Opening Stock
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.openingStock}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Purchases
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.purchases}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Sales
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.sales}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Closing Stock
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.closingStock}
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
          Total Value
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalValue?.toLocaleString()}
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
          Last Updated
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.lastUpdated}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewFIFO;
