"use client";
import React, { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const CreateGoodsReceiptNote = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    receiptDate: "",
    supplierName: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    invoiceNumber: "",
    receivedBy: "",
    notes: ""
  });

  const suppliers = ["ABC Suppliers", "XYZ Electronics", "Tech Solutions", "Global Supplies", "Prime Vendors"];
  const products = ["Laptop Pro 15", "Office Chair", "LED TV 43", "Wireless Mouse", "Keyboard", "Monitor 24"];
  const receivedByOptions = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"];

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
    handleCreate(formData);
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
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateGoodsReceiptNote;
