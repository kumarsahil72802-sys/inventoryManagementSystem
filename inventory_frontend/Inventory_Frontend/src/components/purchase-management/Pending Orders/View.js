import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip
} from '@mui/material';

const ViewPendingOrder = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "success";
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
            Total Amount
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ₹{viewData.totalAmount?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Expected Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.expectedDate}
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
      </Grid>
    </Box>
  );
};

export default ViewPendingOrder;