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
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { fetchCustomers } from '../../../lib/customerApi';
import { fetchItems } from '../../../lib/itemApi';
import { fetchWarehouses } from '../../../lib/warehouseApi';

const CreateSalesOrder = ({ handleClose, handleCreate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    orderDate: "",
    deliveryDate: "",
    customerId: "",
    customerName: "",
    productId: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    paymentStatus: "Pending",
    status: "Pending",
    warehouse: "",
    shippingAddress: "",
    notes: ""
  });

  const paymentStatuses = ["Pending", "Partial", "Paid"];
  const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersRes, productsRes, warehousesRes] = await Promise.all([
          fetchCustomers(1, 100),
          fetchItems(1, 100),
          fetchWarehouses()
        ]);
        setCustomers(customersRes.data || []);
        setProducts(productsRes.data || []);
        setWarehouses(warehousesRes || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load required data. Please try again.');
      }
    };
    loadData();
  }, []);

  const handleCustomerChange = (e) => {
    const selectedCustomer = customers.find(c => (c.id || c._id) === e.target.value);
    setFormData(prev => ({
      ...prev,
      customerId: e.target.value,
      customerName: selectedCustomer ? (selectedCustomer.customerName || selectedCustomer.name) : ''
    }));
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(p => (p.id || p._id) === e.target.value);
    setFormData(prev => ({
      ...prev,
      productId: e.target.value,
      productName: selectedProduct ? (selectedProduct.productName || selectedProduct.name) : '',
      unitPrice: selectedProduct ? (selectedProduct.sellingPrice || 0) : ''
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Auto-calculate total amount
      if (name === "quantity" || name === "unitPrice") {
        const quantity = name === "quantity" ? parseFloat(value) || 0 : parseFloat(prev.quantity) || 0;
        const price = name === "unitPrice" ? parseFloat(value) || 0 : parseFloat(prev.unitPrice) || 0;
        updated.totalAmount = (quantity * price).toString();
      }
      
      return updated;
    });
  };

  const handleSave = async () => {
    setError(null);
    
    // Validation
    if (!formData.orderDate || !formData.deliveryDate || !formData.customerId || !formData.productId || 
        !formData.quantity || !formData.unitPrice || !formData.warehouse || !formData.shippingAddress) {
      setError('Please fill all required fields');
      return;
    }

    const selectedProduct = products.find(p => (p.id || p._id) === formData.productId);
    const quantity = parseFloat(formData.quantity);
    const unitPrice = parseFloat(formData.unitPrice);
    const totalAmount = quantity * unitPrice;
    const taxAmount = totalAmount * 0.18; // 18% GST
    const subtotal = totalAmount;
    const grandTotal = subtotal + taxAmount;

    // Get current user from localStorage
    let createdBy = null;
    try {
      const userData = localStorage.getItem('inventory_user');
      if (userData) {
        const user = JSON.parse(userData);
        createdBy = user.id || user._id;
      }
    } catch (e) {
      console.warn('Could not get user from localStorage');
    }

    // Build payload matching backend schema
    const payload = {
      customerId: formData.customerId,
      customerName: formData.customerName,
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      items: [{
        itemId: formData.productId,
        itemName: formData.productName,
        sku: selectedProduct?.skuCode || 'N/A',
        quantity: quantity,
        unit: selectedProduct?.unitOfMeasure || 'Pieces',
        sellingPrice: unitPrice,
        discount: 0,
        totalAmount: totalAmount
      }],
      subtotal: subtotal,
      discountAmount: 0,
      taxAmount: taxAmount,
      totalAmount: grandTotal,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      warehouse: formData.warehouse,
      shippingAddress: formData.shippingAddress,
      notes: formData.notes,
      createdBy: createdBy
    };

    try {
      setLoading(true);
      await handleCreate(payload);
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err?.message || 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3}>
      {error && (
        <Grid size={12}>
          <Alert severity="error">{error}</Alert>
        </Grid>
      )}
      
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
          <InputLabel>Customer</InputLabel>
          <Select
            name="customerId"
            value={formData.customerId}
            onChange={handleCustomerChange}
          >
            {customers.map((customer) => (
              <MenuItem key={customer.id || customer._id} value={customer.id || customer._id}>
                {customer.customerName || customer.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Product</InputLabel>
          <Select
            name="productId"
            value={formData.productId}
            onChange={handleProductChange}
          >
            {products.map((product) => (
              <MenuItem key={product.id || product._id} value={product.id || product._id}>
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
          label="Unit Price (₹)"
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
          label="Total Amount (₹)"
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          disabled
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
              <MenuItem key={warehouse.id || warehouse._id} value={warehouse.id || warehouse._id}>
                {warehouse.warehouseName || warehouse.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Payment Status</InputLabel>
          <Select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
          >
            {paymentStatuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Order Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Shipping Address"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          required
          multiline
          rows={2}
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
          rows={2}
        />
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          disabled={loading}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={16} />}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateSalesOrder;