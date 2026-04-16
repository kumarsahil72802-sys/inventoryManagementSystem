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
import { fetchWarehouses } from '../../../lib/warehouseApi';

const EditOrderTracking = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    orderId: "",
    orderDate: "",
    customerName: "",
    productName: "",
    quantityOrdered: "",
    estimatedDelivery: "",
    warehouse: "",
    currentStatus: "",
    notes: ""
  });

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statuses = ["Processing", "In Transit", "Out for Delivery", "Delivered"];

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersRes, customersRes, productsRes, warehousesRes] = await Promise.all([
          getAllSalesOrders(),
          fetchCustomers(1, 100),
          fetchItems(1, 100),
          fetchWarehouses()
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
        
        // Extract warehouses data
        const warehousesData = Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes?.data || []);
        setWarehouses(warehousesData);
        
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
        orderDate: editData.orderDate || '',
        customerName: editData.customerName || '',
        productName: editData.productName || '',
        quantityOrdered: editData.quantityOrdered || '',
        estimatedDelivery: editData.estimatedDelivery || '',
        warehouse: editData.warehouse || '',
        currentStatus: editData.currentStatus || '',
        notes: editData.notes || ''
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
    if (!formData.orderId || !formData.orderDate || !formData.customerName || !formData.productName || !formData.quantityOrdered || !formData.estimatedDelivery || !formData.warehouse || !formData.currentStatus) {
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
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id || warehouse._id || warehouse.warehouseName} value={warehouse.warehouseName || warehouse.name}>
                {warehouse.warehouseName || warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Current Status</InputLabel>
          <Select
            name="currentStatus"
            value={formData.currentStatus}
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

export default EditOrderTracking;
