'use client';

import React, { useState } from 'react';
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

const CreateBatch = ({ onClose, onSave, products = [], suppliers = [] }) => {
  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    serialNumber: '',
    quantity: '',
    expiryDate: '',
    manufacturingDate: '',
    supplier: ''
  });

  const [errors, setErrors] = useState({});

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
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required';
    if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required';
    if (!formData.manufacturingDate) newErrors.manufacturingDate = 'Manufacturing date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const payload = {
        ...formData,
        status: 'Active',
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
            value={formData.quantity}
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
        <Grid size={{ xs: 12, md: 12 }}>
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
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CreateBatch;
