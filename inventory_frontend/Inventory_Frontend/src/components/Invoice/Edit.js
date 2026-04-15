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
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

const EditInvoice = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    billingAddress: "",
    supplierName: "",
    supplierEmail: "",
    supplierPhone: "",
    supplierAddress: "",
    invoiceDate: "",
    dueDate: "",
    items: [{ productName: "", quantity: "", unitPrice: "", total: 0 }],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    totalAmount: 0,
    status: "",
    paymentTerms: "Net 30",
    notes: ""
  });

  const customers = ["Tech Solutions Pvt Ltd", "Office Supplies Co", "Retail Store Chain", "Manufacturing Corp", "Service Provider Ltd"];
  const suppliers = ["Electronics Hub", "Furniture World", "Kitchen Supplies", "Office Depot", "Industrial Supplies"];
  const products = ["Samsung Galaxy S24", "Office Chair", "Coffee Mug", "LED TV", "Wireless Mouse", "Keyboard", "Desk Lamp", "Tea Set"];
  const paymentTerms = ["Net 7", "Net 15", "Net 30", "Net 45", "Net 60"];
  const statuses = ["Paid", "Pending", "Overdue"];

  useEffect(() => {
    if (editData) {
      setFormData({
        invoiceNumber: editData.invoiceNumber || '',
        customerName: editData.customerName || '',
        customerEmail: editData.customerEmail || '',
        customerPhone: editData.customerPhone || '',
        billingAddress: editData.billingAddress || '',
        supplierName: editData.supplierName || '',
        supplierEmail: editData.supplierEmail || '',
        supplierPhone: editData.supplierPhone || '',
        supplierAddress: editData.supplierAddress || '',
        invoiceDate: editData.invoiceDate || '',
        dueDate: editData.dueDate || '',
        items: editData.items || [{ productName: "", quantity: "", unitPrice: "", total: 0 }],
        subtotal: editData.subtotal || 0,
        taxRate: editData.taxRate || 18,
        taxAmount: editData.taxAmount || 0,
        totalAmount: editData.totalAmount || 0,
        status: editData.status || '',
        paymentTerms: editData.paymentTerms || 'Net 30',
        notes: editData.notes || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    
    // Calculate total for this item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = parseFloat(newItems[index].quantity) || 0;
      const unitPrice = parseFloat(newItems[index].unitPrice) || 0;
      newItems[index].total = quantity * unitPrice;
    }
    
    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productName: "", quantity: "", unitPrice: "", total: 0 }]
    });
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
      calculateTotals(newItems);
    }
  };

  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * formData.taxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount
    }));
  };

  const handleSave = () => {
    if (!formData.invoiceNumber || !formData.customerName || !formData.supplierName || 
        !formData.invoiceDate || !formData.dueDate || !formData.status || 
        formData.items.some(item => !item.productName || !item.quantity || !item.unitPrice)) {
      alert('Please fill all required fields');
      return;
    }
    handleUpdate({ ...editData, ...formData });
    handleClose();
  };

  return (
    <Grid container spacing={3}>
      {/* Invoice Header */}
      <Grid size={12}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Invoice Information
        </Typography>
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
          <InputLabel>Payment Terms</InputLabel>
          <Select
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
          >
            {paymentTerms.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid size={6}>
        <TextField
          fullWidth
          label="Invoice Date"
          type="date"
          name="invoiceDate"
          value={formData.invoiceDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Due Date"
          type="date"
          name="dueDate"
          value={formData.dueDate}
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
      <Grid size={6}>
        <TextField
          fullWidth
          label="Tax Rate (%)"
          type="number"
          name="taxRate"
          value={formData.taxRate}
          onChange={handleChange}
        />
      </Grid>

      {/* Customer Information */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Customer Information
        </Typography>
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
        <TextField
          fullWidth
          label="Customer Email"
          type="email"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleChange}
        />
      </Grid>
      
      <Grid size={6}>
        <TextField
          fullWidth
          label="Customer Phone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Billing Address"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Grid>

      {/* Supplier Information */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
          Supplier Information
        </Typography>
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
        <TextField
          fullWidth
          label="Supplier Email"
          type="email"
          name="supplierEmail"
          value={formData.supplierEmail}
          onChange={handleChange}
        />
      </Grid>
      
      <Grid size={6}>
        <TextField
          fullWidth
          label="Supplier Phone"
          name="supplierPhone"
          value={formData.supplierPhone}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Supplier Address"
          name="supplierAddress"
          value={formData.supplierAddress}
          onChange={handleChange}
          multiline
          rows={2}
        />
      </Grid>

      {/* Items */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
            Invoice Items
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addItem}
            size="small"
            sx={{ transform: 'none', textTransform: 'none' }}
          >
            Add Item
          </Button>
        </Box>
      </Grid>

      {formData.items.map((item, index) => (
        <React.Fragment key={index}>
          <Grid size={4}>
            <FormControl fullWidth required>
              <InputLabel>Product Name</InputLabel>
              <Select
                value={item.productName}
                onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
              >
                {products.map((product) => (
                  <MenuItem key={product} value={product}>
                    {product}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              required
            />
          </Grid>
          <Grid size={2}>
            <TextField
              fullWidth
              label="Unit Price"
              type="number"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
              required
            />
          </Grid>
          <Grid size={2}>
            <TextField
              fullWidth
              label="Total"
              value={`₹${item.total.toLocaleString()}`}
              disabled
            />
          </Grid>
          <Grid size={2}>
            <IconButton
              onClick={() => removeItem(index)}
              disabled={formData.items.length === 1}
              sx={{ color: '#f44336' }}
            >
              <Delete />
            </IconButton>
          </Grid>
        </React.Fragment>
      ))}

      {/* Totals */}
      <Grid size={12}>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ width: 300 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>₹{formData.subtotal.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>GST ({formData.taxRate}%):</Typography>
              <Typography>₹{formData.taxAmount.toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, fontWeight: 'bold', fontSize: '1.1rem', color: '#1976d2' }}>
              <Typography>Total Amount:</Typography>
              <Typography>₹{formData.totalAmount.toLocaleString()}</Typography>
            </Box>
          </Box>
        </Box>
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
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Update Invoice
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditInvoice;
