import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip
} from '@mui/material';

const ViewPurchaseOrder = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "success";
      case "Pending": return "warning";
      case "Approved": return "info";
      default: return "default";
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
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
            Supplier Name
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.supplierName}
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
            Total Amount
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ₹{viewData.totalAmount?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Payment Terms
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.paymentTerms}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Status
          </Typography>
          <Chip 
            label={viewData.status} 
            color={getStatusColor(viewData.status)}
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={12}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Shipping Address
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.shippingAddress}
          </Typography>
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
    </Box>
  );
};

export default ViewPurchaseOrder;