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
  CircularProgress,
  Box,
} from "@mui/material";
import { getAllSalesOrders } from '../../../lib/salesApi';
import { fetchCustomers } from '../../../lib/customerApi';
import { fetchItems } from '../../../lib/itemApi';

const CreateDeliveryChallan = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    productName: "",
    quantity: "",
    deliveryDate: "",
    deliveryAddress: "",
    dispatchType: "",
    notes: ""
  });

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dispatchTypes = ["Standard", "Express", "Same Day", "Scheduled"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          getAllSalesOrders(),
          fetchCustomers(1, 100),
          fetchItems(1, 100)
        ]);
        
        // Extract orders data - handle different response structures
        const ordersData = ordersRes?.data || ordersRes || [];
        setOrders(ordersData);
        
        // Extract customers data
        const customersData = customersRes?.data || customersRes || [];
        setCustomers(customersData);
        
        // Extract products data
        const productsData = productsRes?.data || productsRes || [];
        setProducts(productsData);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        {error}
      </Box>
    );
  }

  const handleSave = () => {
    if (!formData.orderId || !formData.customerName || !formData.productName || !formData.quantity || !formData.deliveryDate || !formData.deliveryAddress || !formData.dispatchType) {
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
            {orders.map((order) => (
              <MenuItem key={order.id || order._id} value={order.salesOrderId || order.orderNumber || order.id}>
                {order.salesOrderId || order.orderNumber || order.id}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              <MenuItem key={customer.id || customer._id || customer.customerName} value={customer.customerName || customer.name}>
                {customer.customerName || customer.name}
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
              <MenuItem key={product.id || product._id || product.productName} value={product.productName || product.name}>
                {product.productName || product.name}
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
          label="Delivery Date"
          type="date"
          name="deliveryDate"
          value={formData.deliveryDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Dispatch Type</InputLabel>
          <Select
            name="dispatchType"
            value={formData.dispatchType}
            onChange={handleChange}
          >
            {dispatchTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Delivery Address"
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          multiline
          rows={3}
          required
        />
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

export default CreateDeliveryChallan;
