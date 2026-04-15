"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewCOGS = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getMarginColor = (margin) => {
    if (margin >= 30) return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
    if (margin >= 20) return { backgroundColor: "#e3f2fd", color: "#1976d2" };
    if (margin >= 10) return { backgroundColor: "#fff3e0", color: "#f57c00" };
    return { backgroundColor: "#ffebee", color: "#d32f2f" };
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          COGS ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.cogsId}
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
          Cost Price
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.costPrice?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Selling Price
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.sellingPrice?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Quantity Sold
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.quantitySold}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Period
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.period}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Total Cost
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalCost?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Total Revenue
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalRevenue?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Gross Profit
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.grossProfit?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Gross Margin
        </Typography>
        <Chip
          label={`${viewData.grossMargin}%`}
          size="small"
          sx={{
            ...getMarginColor(viewData.grossMargin),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
    </Grid>
  );
};

export default ViewCOGS;
