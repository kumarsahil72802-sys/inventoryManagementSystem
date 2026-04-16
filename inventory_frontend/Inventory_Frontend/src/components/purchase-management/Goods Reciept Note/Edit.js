"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const EditGoodsReceiptNote = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    receiptDate: "",
    supplierName: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    invoiceNumber: "",
    receivedBy: "",
    notes: "",
    status: "Pending"
  });

  const suppliers = ["ABC Suppliers", "XYZ Electronics", "Tech Solutions", "Global Supplies", "Prime Vendors"];
  const products = ["Laptop Pro 15", "Office Chair", "LED TV 43", "Wireless Mouse", "Keyboard", "Monitor 24"];
  const receivedByOptions = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"];
  const statuses = ["Pending", "Received", "Verified", "Rejected"];

  useEffect(() => {
    if (editData) {
      setFormData({
        receiptDate: editData.receiptDate || '',
        supplierName: editData.supplierName || '',
        productName: editData.productName || '',
        quantity: editData.quantity || '',
        unitPrice: editData.unitPrice || '',
        totalAmount: editData.totalAmount || '',
        invoiceNumber: editData.invoiceNumber || '',
        receivedBy: editData.receivedBy || '',
        notes: editData.notes || '',
        status: editData.status || 'Pending'
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-calculate total amount
    if (name === "quantity" || name === "unitPrice") {
      const quantity = name === "quantity" ? value : formData.quantity;
      const price = name === "unitPrice" ? value : formData.unitPrice;
      if (quantity && price) {
        setFormData(prev => ({ ...prev, totalAmount: (parseFloat(quantity) * parseFloat(price)).toString() }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.receiptDate || !formData.supplierName || !formData.productName || !formData.quantity || !formData.unitPrice || !formData.totalAmount || !formData.invoiceNumber || !formData.receivedBy) {
      alert('Please fill all required fields');
      return;
    }
    handleUpdate({ ...editData, ...formData });
    handleClose();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Receipt Date"
          type="date"
          name="receiptDate"
          value={formData.receiptDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Supplier Name</InputLabel>
          <Select
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier} value={supplier}>
                {supplier}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Product Name</InputLabel>
          <Select
            name="productName"
            value={formData.productName}
            onChange={handleChange}
          >
            {products.map((product) => (
              <MenuItem key={product} value={product}>
                {product}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Unit Price"
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Total Amount"
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          disabled
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Invoice Number"
          name="invoiceNumber"
          value={formData.invoiceNumber}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Received By</InputLabel>
          <Select
            name="receivedBy"
            value={formData.receivedBy}
            onChange={handleChange}
          >
            {receivedByOptions.map((person) => (
              <MenuItem key={person} value={person}>
                {person}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
        />
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditGoodsReceiptNote;
