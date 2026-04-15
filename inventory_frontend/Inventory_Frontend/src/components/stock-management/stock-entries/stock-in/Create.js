"use client";
import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Grid, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function CreateStockIn({ handleClose, handleCreate }) {
  const [stockData, setStockData] = useState({
    // Basic Entry Details
    entryId: "",
    productId: "",
    productName: "",
    supplierId: "",
    supplierName: "",
    supplierContact: "",
    supplierEmail: "",
    
    // Stock Details
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    batchNumber: "",
    expiryDate: "",
    
    // Additional Details
    date: "",
    paymentStatus: "",
    notes: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!stockData.entryId) tempErrors.entryId = "Entry ID is required";
    if (!stockData.date) tempErrors.date = "Date is required";
    if (!stockData.productId) tempErrors.productId = "Product ID is required";
    if (!stockData.productName) tempErrors.productName = "Product Name is required";
    if (!stockData.supplierId) tempErrors.supplierId = "Supplier ID is required";
    if (!stockData.quantity || stockData.quantity <= 0) tempErrors.quantity = "Valid quantity is required";
    if (!stockData.unitPrice || stockData.unitPrice <= 0) tempErrors.unitPrice = "Valid unit price is required";
    if (!stockData.batchNumber) tempErrors.batchNumber = "Batch number is required";
    if (!stockData.paymentStatus) tempErrors.paymentStatus = "Payment status is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (handleCreate) handleCreate(stockData);
    handleClose();
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Stock In Entry</DialogTitle>
      <DialogContent dividers>
        
        <Typography variant="h6" gutterBottom>Entry Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              label="1) Entry ID" 
              name="entryId" 
              value={stockData.entryId} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.entryId}
              helperText={errors.entryId}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              type="date" 
              label="2) Date" 
              name="date" 
              value={stockData.date} 
              onChange={handleChange} 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Product Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              label="3) Product ID" 
              name="productId" 
              value={stockData.productId} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.productId}
              helperText={errors.productId}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="4) Product Name" 
              name="productName" 
              value={stockData.productName} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.productName}
              helperText={errors.productName}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Supplier Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              label="5) Supplier ID" 
              name="supplierId" 
              value={stockData.supplierId} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.supplierId}
              helperText={errors.supplierId}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="6) Supplier Name" 
              name="supplierName" 
              value={stockData.supplierName} 
              onChange={handleChange} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="7) Supplier Contact" 
              name="supplierContact" 
              value={stockData.supplierContact} 
              onChange={handleChange} 
              fullWidth 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="8) Supplier Email" 
              name="supplierEmail" 
              value={stockData.supplierEmail} 
              onChange={handleChange} 
              fullWidth 
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Stock Details</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField 
              label="9) Quantity" 
              name="quantity" 
              type="number"
              value={stockData.quantity} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.quantity}
              helperText={errors.quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="10) Unit Price" 
              name="unitPrice" 
              type="number"
              value={stockData.unitPrice} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.unitPrice}
              helperText={errors.unitPrice}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="11) Total Amount" 
              name="totalAmount" 
              value={stockData.totalAmount} 
              onChange={handleChange} 
              fullWidth 
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              label="12) Batch Number" 
              name="batchNumber" 
              value={stockData.batchNumber} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.batchNumber}
              helperText={errors.batchNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              type="date" 
              label="13) Expiry Date" 
              name="expiryDate" 
              value={stockData.expiryDate} 
              onChange={handleChange} 
              fullWidth 
              InputLabelProps={{ shrink: true }} 
            />
          </Grid>
          <Grid item xs={6}>
            <TextField 
              select
              label="14) Payment Status" 
              name="paymentStatus" 
              value={stockData.paymentStatus} 
              onChange={handleChange} 
              fullWidth 
              error={!!errors.paymentStatus}
              helperText={errors.paymentStatus}
            >
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField 
              select
              label="15) Status" 
              name="status" 
              value={stockData.status} 
              onChange={handleChange} 
              fullWidth 
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField 
              label="16) Notes" 
              name="notes" 
              value={stockData.notes} 
              onChange={handleChange} 
              fullWidth 
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
