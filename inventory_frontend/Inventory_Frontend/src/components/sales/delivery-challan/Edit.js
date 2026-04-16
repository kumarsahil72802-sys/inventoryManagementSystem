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

const EditDeliveryChallan = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    customerName: "",
    deliveryDate: "",
    deliveryAddress: "",
    notes: "",
    status: "Pending"
  });

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ["Pending", "In Transit", "Delivered"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersRes, customersRes] = await Promise.all([
          getAllSalesOrders(),
          fetchCustomers(1, 100)
        ]);
        
        // Extract orders data - handle different response structures
        const ordersData = ordersRes?.data || ordersRes || [];
        setOrders(ordersData);
        
        // Extract customers data
        const customersData = customersRes?.data || customersRes || [];
        setCustomers(customersData);
        
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

  useEffect(() => {
    if (editData) {
      setFormData({
        orderId: editData.orderId || '',
        customerName: editData.customerName || '',
        deliveryDate: editData.deliveryDate || '',
        deliveryAddress: editData.deliveryAddress || '',
        notes: editData.notes || '',
        status: editData.status || 'Pending'
      });
    }
  }, [editData]);

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
    if (!formData.orderId || !formData.customerName || !formData.deliveryDate || !formData.deliveryAddress) {
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
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditDeliveryChallan;
