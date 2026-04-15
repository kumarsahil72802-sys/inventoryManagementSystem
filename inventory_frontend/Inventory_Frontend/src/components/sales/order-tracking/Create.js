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

const CreateOrderTracking = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    orderDate: "",
    customerName: "",
    productName: "",
    quantityOrdered: "",
    estimatedDelivery: "",
    warehouse: "",
    notes: ""
  });

  const orderIds = ["SO001", "SO002", "SO003", "SO004", "SO005"];
  const customers = ["ABC Electronics", "XYZ Furniture", "Tech Solutions", "Global Corp", "Prime Industries"];
  const products = ["Samsung Galaxy S24", "Office Chair", "LED TV 43", "Wireless Mouse", "Keyboard", "Monitor 24"];
  const warehouses = ["Main Warehouse", "North Warehouse", "South Warehouse", "East Warehouse", "West Warehouse"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.orderId || !formData.orderDate || !formData.customerName || !formData.productName || !formData.quantityOrdered || !formData.estimatedDelivery || !formData.warehouse) {
      alert('Please fill all required fields');
      return;
    }
    handleCreate(formData);
    handleClose();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Order ID</InputLabel>
          <Select
            name="orderId"
            value={formData.orderId}
            onChange={handleChange}
          >
            {orderIds.map((orderId) => (
              <MenuItem key={orderId} value={orderId}>
                {orderId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Order Date"
          type="date"
          name="orderDate"
          value={formData.orderDate}
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
          label="Quantity Ordered"
          type="number"
          name="quantityOrdered"
          value={formData.quantityOrdered}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Estimated Delivery"
          type="date"
          name="estimatedDelivery"
          value={formData.estimatedDelivery}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
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

export default CreateOrderTracking;
