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

const EditSalesReturn = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    returnDate: "",
    customerName: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    returnAmount: "",
    reason: "",
    notes: "",
    status: "Pending"
  });

  const customers = ["ABC Electronics", "XYZ Furniture", "Tech Solutions", "Global Corp", "Prime Industries"];
  const products = ["Samsung Galaxy S24", "Office Chair", "LED TV 43", "Wireless Mouse", "Keyboard", "Monitor 24"];
  const reasons = ["Defective Product", "Wrong Item", "Customer Request", "Quality Issues", "Damaged in Transit"];
  const statuses = ["Pending", "Approved", "Processed", "Rejected"];

  useEffect(() => {
    if (editData) {
      setFormData({
        returnDate: editData.returnDate || '',
        customerName: editData.customerName || '',
        productName: editData.productName || '',
        quantity: editData.quantity || '',
        unitPrice: editData.unitPrice || '',
        returnAmount: editData.returnAmount || '',
        reason: editData.reason || '',
        notes: editData.notes || '',
        status: editData.status || 'Pending'
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-calculate return amount
    if (name === "quantity" || name === "unitPrice") {
      const quantity = name === "quantity" ? value : formData.quantity;
      const price = name === "unitPrice" ? value : formData.unitPrice;
      if (quantity && price) {
        setFormData(prev => ({ ...prev, returnAmount: (parseFloat(quantity) * parseFloat(price)).toString() }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.returnDate || !formData.customerName || !formData.productName || !formData.quantity || !formData.unitPrice || !formData.returnAmount || !formData.reason) {
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
          label="Return Date"
          type="date"
          name="returnDate"
          value={formData.returnDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Customer Name</InputLabel>
          <Select
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
          >
            {customers.map((customer) => (
              <MenuItem key={customer} value={customer}>
                {customer}
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
          label="Return Amount"
          type="number"
          name="returnAmount"
          value={formData.returnAmount}
          onChange={handleChange}
          disabled
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Reason</InputLabel>
          <Select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          >
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
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

export default EditSalesReturn;
