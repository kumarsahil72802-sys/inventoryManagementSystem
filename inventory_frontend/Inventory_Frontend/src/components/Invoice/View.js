"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ViewInvoice = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Overdue":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      {/* Invoice Header */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Invoice: {viewData.invoiceNumber}
          </Typography>
          <Chip
            label={viewData.status}
            size="small"
            sx={{
              ...getStatusColor(viewData.status),
              fontWeight: 500
            }}
          />
        </Box>
      </Grid>

      {/* Invoice Details */}
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Invoice Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {new Date(viewData.invoiceDate).toLocaleDateString('en-IN')}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Due Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {new Date(viewData.dueDate).toLocaleDateString('en-IN')}
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
          Total Amount
        </Typography>
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2', fontSize: '1.1rem' }}>
          ₹{viewData.totalAmount.toLocaleString()}
        </Typography>
      </Grid>

      {/* Customer Information */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Customer Information
        </Typography>
      </Grid>
      
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.customerName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Customer Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.customerEmail}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Customer Phone
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.customerPhone}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Billing Address
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.billingAddress}
        </Typography>
      </Grid>

      {/* Supplier Information */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Supplier Information
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
          Supplier Email
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.supplierEmail}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Supplier Phone
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.supplierPhone}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Supplier Address
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.supplierAddress}
        </Typography>
      </Grid>

      {/* Invoice Items */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Invoice Items
        </Typography>
      </Grid>
      
      <Grid size={12}>
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {viewData.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{item.unitPrice.toLocaleString()}</TableCell>
                  <TableCell align="right">₹{item.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

      {/* Totals */}
      <Grid size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Box sx={{ width: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>₹{viewData.subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>GST ({viewData.taxRate}%):</Typography>
              <Typography>₹{viewData.taxAmount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontWeight: 'bold', fontSize: '1.1rem', color: '#1976d2' }}>
              <Typography>Total Amount:</Typography>
              <Typography>₹{viewData.totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      {/* Notes */}
      {viewData.notes && (
        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
            Notes
          </Typography>
          <Typography variant="body1" sx={{ 
            backgroundColor: '#fff3e0', 
            padding: 2, 
            borderRadius: 1, 
            borderLeft: '4px solid #f57c00',
            fontStyle: 'italic'
          }}>
            {viewData.notes}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ViewInvoice;
