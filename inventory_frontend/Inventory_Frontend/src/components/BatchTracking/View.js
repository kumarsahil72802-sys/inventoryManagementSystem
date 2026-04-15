'use client';

import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewBatch = ({ batchData }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getProductName = (productId) => {
    const products = [
      { id: 'PROD001', name: 'Samsung Galaxy S24' },
      { id: 'PROD002', name: 'Dell Inspiron 15' },
      { id: 'PROD003', name: 'Office Chair' },
      { id: 'PROD004', name: 'Coffee Mug' }
    ];
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Unknown';
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Batch ID
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {batchData?.id}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Status
          </Typography>
          <Chip 
            label={batchData?.status} 
            color={getStatusColor(batchData?.status)}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Product
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {getProductName(batchData?.productId)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Batch Number
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {batchData?.batchNumber}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Serial Number
          </Typography>
          <Typography variant="body1">
            {batchData?.serialNumber || 'N/A'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Quantity
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {batchData?.quantity}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Manufacturing Date
          </Typography>
          <Typography variant="body1">
            {batchData?.manufacturingDate}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Expiry Date
          </Typography>
          <Typography variant="body1">
            {batchData?.expiryDate || 'N/A'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Supplier
          </Typography>
          <Typography variant="body1">
            {batchData?.supplier || 'N/A'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Created Date
          </Typography>
          <Typography variant="body1">
            {batchData?.createdDate}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewBatch;
