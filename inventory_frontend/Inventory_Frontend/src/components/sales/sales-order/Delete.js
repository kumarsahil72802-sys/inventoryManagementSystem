"use client";
import { Button, Grid, Typography, Alert, Box } from "@mui/material";

const DeleteSalesOrder = ({ orderData, onClose, onDelete }) => {
  if (!orderData) return null;

  // Extract data from backend format or simple format
  const orderId = orderData.salesOrderId || orderData.orderNumber || orderData.orderId || 'N/A';
  const customerName = orderData.customerName || 'N/A';
  const item = orderData.items && orderData.items[0] ? orderData.items[0] : {};
  const productName = item.itemName || orderData.productName || 'N/A';
  const totalAmount = orderData.totalAmount || 0;

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this sales order?
        </Typography>
        <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Order ID:</strong> {orderId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Customer:</strong> {customerName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Product:</strong> {productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Total Amount:</strong> ₹{Number(totalAmount).toLocaleString()}
          </Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={onDelete} 
          variant="contained" 
          color="error"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Grid>
    </Grid>
  );
};

export default DeleteSalesOrder;