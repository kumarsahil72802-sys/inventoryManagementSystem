import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Chip
} from '@mui/material';

const ViewPurchaseReturn = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed": return "success";
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
            Return Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.returnDate}
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
        <Grid size={12}>
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

export default ViewPurchaseReturn;