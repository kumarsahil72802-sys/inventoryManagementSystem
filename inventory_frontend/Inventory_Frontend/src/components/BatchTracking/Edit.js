'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const EditBatch = ({ batchData, onClose, onSave, products = [], suppliers = [] }) => {
  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    serialNumber: '',
    quantity: '',
    expiryDate: '',
    manufacturingDate: '',
    supplier: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (batchData) {
      setFormData({
        productId: batchData.productId || batchData.itemId || '',
        batchNumber: batchData.batchNumber || '',
        serialNumber: batchData.serialNumber || '',
        quantity: batchData.quantity != null ? batchData.quantity : (batchData.totalQuantity != null ? batchData.totalQuantity : ''),
        expiryDate: batchData.expiryDate || '',
        manufacturingDate: batchData.manufacturingDate || batchData.purchaseDate || '',
        supplier: batchData.supplierId || batchData.supplier || '',
        status: batchData.status || 'Active'
      });
    }
  }, [batchData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) newErrors.productId = 'Product is required';
    if (!String(formData.batchNumber || '').trim()) newErrors.batchNumber = 'Batch number is required';
    if (formData.quantity === '' || formData.quantity == null || (String(formData.quantity).trim() === '')) newErrors.quantity = 'Quantity is required';
    if (!formData.manufacturingDate) newErrors.manufacturingDate = 'Manufacturing date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const payload = {
        ...batchData,
        ...formData,
        productId: formData.productId,
        supplierId: formData.supplier || undefined,
      };
      onSave(payload);
      onClose();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Select
              value={formData.productId}
              onChange={(e) => handleInputChange('productId', e.target.value)}
              label="Product"
              error={!!errors.productId}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.productId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.productId}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Batch Number"
            value={formData.batchNumber}
            onChange={(e) => handleInputChange('batchNumber', e.target.value)}
            error={!!errors.batchNumber}
            helperText={errors.batchNumber}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Serial Number"
            value={formData.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Quantity"
            type="number"
            value={formData.quantity !== '' && formData.quantity != null ? formData.quantity : ''}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            error={!!errors.quantity}
            helperText={errors.quantity}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Manufacturing Date"
            type="date"
            value={formData.manufacturingDate}
            onChange={(e) => handleInputChange('manufacturingDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
            error={!!errors.manufacturingDate}
            helperText={errors.manufacturingDate}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Expiry Date"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Supplier</InputLabel>
            <Select
              value={formData.supplier}
              onChange={(e) => handleInputChange('supplier', e.target.value)}
              label="Supplier"
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ 
            transform: 'none', 
            textTransform: 'none',
            backgroundColor: '#000',
            '&:hover': {
              backgroundColor: '#333'
            }
          }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditBatch;
