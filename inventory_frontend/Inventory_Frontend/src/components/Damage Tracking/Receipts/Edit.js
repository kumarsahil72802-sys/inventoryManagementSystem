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

const EditReceipt = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    productName: "",
    receiptNumber: "",
    receiptDate: "",
    amount: "",
    supplier: "",
    status: "",
    warehouse: ""
  });

  const products = ["Samsung Galaxy S24", "Office Chair", "Coffee Mug", "LED TV", "Wireless Mouse", "Keyboard"];
  const suppliers = ["Samsung India", "Furniture World", "Kitchen Supplies", "Electronics Hub", "Office Depot"];
  const statuses = ["Pending", "Verified", "Rejected"];
  const warehouses = ["Main Warehouse", "North Warehouse", "South Warehouse", "East Warehouse", "West Warehouse"];

  useEffect(() => {
    if (editData) {
      setFormData({
        productName: editData.productName || '',
        receiptNumber: editData.receiptNumber || '',
        receiptDate: editData.receiptDate || '',
        amount: editData.amount || '',
        supplier: editData.supplier || '',
        status: editData.status || '',
        warehouse: editData.warehouse || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.productName || !formData.receiptNumber || !formData.receiptDate || !formData.amount || !formData.supplier || !formData.status || !formData.warehouse) {
      alert('Please fill all required fields');
      return;
    }
    handleUpdate({ ...editData, ...formData });
    handleClose();
  };

  return (
    <Grid container spacing={3}>
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
          label="Receipt Number"
          name="receiptNumber"
          value={formData.receiptNumber}
          onChange={handleChange}
          required
        />
      </Grid>
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
        <TextField
          fullWidth
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Supplier</InputLabel>
          <Select
            name="supplier"
            value={formData.supplier}
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
        <FormControl fullWidth required>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse} value={warehouse}>
                {warehouse}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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

export default EditReceipt;
