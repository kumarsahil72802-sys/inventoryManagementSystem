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
  Alert,
  CircularProgress,
} from "@mui/material";
import { fetchCustomers } from '../../../lib/customerApi';
import { fetchItems } from '../../../lib/itemApi';
import { fetchWarehouses } from '../../../lib/warehouseApi';

const EditSalesOrder = ({ editData, handleUpdate, handleClose }) => {
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
        setError('Failed to load required data');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (editData) {
      // Extract data from backend format (items array) or simple format
      const item = editData.items && editData.items[0] ? editData.items[0] : {};
      
      setFormData({
        orderDate: editData.orderDate ? new Date(editData.orderDate).toISOString().split('T')[0] : '',
        deliveryDate: editData.deliveryDate ? new Date(editData.deliveryDate).toISOString().split('T')[0] : '',
        customerId: editData.customerId || '',
        customerName: editData.customerName || '',
        productId: item.itemId || '',
        productName: item.itemName || editData.productName || '',
        quantity: item.quantity || editData.quantity || '',
        unitPrice: item.sellingPrice || editData.unitPrice || '',
        totalAmount: item.totalAmount || editData.totalAmount || '',
        paymentStatus: editData.paymentStatus || 'Pending',
        status: editData.status || editData.orderStatus || 'Pending',
        warehouse: editData.warehouse || '',
        shippingAddress: editData.shippingAddress || '',
        notes: editData.notes || ''
      });
    }
  }, [editData]);

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
    
    if (!formData.orderDate || !formData.deliveryDate || !formData.status || !formData.paymentStatus) {
      setError('Please fill all required fields');
      return;
    }

    const quantity = parseFloat(formData.quantity) || 0;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const totalAmount = quantity * unitPrice;
    const taxAmount = totalAmount * 0.18; // 18% GST
    const subtotal = totalAmount;
    const grandTotal = subtotal + taxAmount;

    // Build update payload - only send fields that can be updated
    const payload = {
      orderDate: formData.orderDate,
      deliveryDate: formData.deliveryDate,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      shippingAddress: formData.shippingAddress,
      notes: formData.notes,
      // If we have item data, update it too
      items: formData.productId ? [{
        itemId: formData.productId,
        itemName: formData.productName,
        quantity: quantity,
        sellingPrice: unitPrice,
        totalAmount: totalAmount
      }] : undefined,
      subtotal: subtotal,
      taxAmount: taxAmount,
      totalAmount: grandTotal
    };

    try {
      setLoading(true);
      await handleUpdate(payload);
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err?.message || 'Failed to update sales order');
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
        <TextField
          fullWidth
          label="Customer"
          value={formData.customerName}
          disabled
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Product"
          value={formData.productName}
          disabled
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
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
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
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
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditSalesOrder;