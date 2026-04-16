"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
} from "@mui/material";

const ViewSalesOrder = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  // Extract data from backend format (items array) or simple format
  const item = viewData.items && viewData.items[0] ? viewData.items[0] : {};
  const orderId = viewData.salesOrderId || viewData.orderNumber || viewData.orderId || 'N/A';
  const customerName = viewData.customerName || 'N/A';
  const productName = item.itemName || viewData.productName || 'N/A';
  const quantity = item.quantity || viewData.quantity || 0;
  const unitPrice = item.sellingPrice || viewData.unitPrice || 0;
  const totalAmount = item.totalAmount || viewData.totalAmount || 0;
  const subtotal = viewData.subtotal || totalAmount || 0;
  const taxAmount = viewData.taxAmount || 0;
  const grandTotal = viewData.totalAmount || 0;
  const orderDate = viewData.orderDate ? new Date(viewData.orderDate).toLocaleDateString() : 'N/A';
  const deliveryDate = viewData.deliveryDate ? new Date(viewData.deliveryDate).toLocaleDateString() : 'N/A';
  const status = viewData.status || viewData.orderStatus || 'Pending';
  const paymentStatus = viewData.paymentStatus || 'Pending';
  const shippingAddress = viewData.shippingAddress || 'N/A';
  const notes = viewData.notes || 'No notes provided';
  const sku = item.sku || 'N/A';
  const unit = item.unit || 'Pieces';

  const getStatusColor = (status) => {
    const normalizedStatus = status || 'Pending';
    switch (normalizedStatus) {
      case "Delivered":
      case "Confirmed":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Processing":
      case "Shipped":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Cancelled":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Partial":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Pending":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Order Info */}
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Order ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {orderId}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Order Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {orderDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Delivery Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {deliveryDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {customerName}
        </Typography>
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 1 }} />
      </Grid>

      {/* Product Info */}
      <Grid size={12}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
          Product Details
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {productName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          SKU
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {sku}
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Quantity
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {quantity} {unit}
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Unit Price
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{Number(unitPrice).toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={4}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Item Total
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{Number(totalAmount).toLocaleString()}
        </Typography>
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 1 }} />
      </Grid>

      {/* Financial Summary */}
      <Grid size={12}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, color: '#1976d2' }}>
          Financial Summary
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          ₹{Number(subtotal).toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary">
          Tax (18% GST)
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          ₹{Number(taxAmount).toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="text.secondary">
          Grand Total
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, color: '#2e7d32', fontWeight: 'bold' }}>
          ₹{Number(grandTotal).toLocaleString()}
        </Typography>
      </Grid>

      <Grid size={12}>
        <Divider sx={{ my: 1 }} />
      </Grid>

      {/* Status & Shipping */}
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Order Status
        </Typography>
        <Chip
          label={status}
          size="small"
          sx={{
            ...getStatusColor(status),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Payment Status
        </Typography>
        <Chip
          label={paymentStatus}
          size="small"
          sx={{
            ...getPaymentStatusColor(paymentStatus),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Shipping Address
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {shippingAddress}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {notes}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewSalesOrder;