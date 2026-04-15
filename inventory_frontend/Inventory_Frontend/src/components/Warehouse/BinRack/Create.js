'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

const CreateBinRack = ({ warehouses = [], onClose, onSave }) => {
  const [formData, setFormData] = useState({
    warehouseName: '',
    zone: '',
    binRackNumber: '',
    binType: '',
    location: '',
    capacity: '',
    currentStock: '',
    occupancy: '',
    productCategory: '',
    level: '1'
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
    
    if (!formData.warehouseName.trim()) newErrors.warehouseName = 'Warehouse name is required';
    if (!formData.zone.trim()) newErrors.zone = 'Zone is required';
    if (!formData.binRackNumber.trim()) newErrors.binRackNumber = 'Bin/Rack number is required';
    if (!formData.binType.trim()) newErrors.binType = 'Bin type is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    if (!formData.productCategory.trim()) newErrors.productCategory = 'Product category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const wh = warehouses.find(w => (w.warehouseName || w.name) === formData.warehouseName);
      const newBinRack = {
        ...formData,
        warehouseId: wh?.id || wh?.warehouseId,
        currentStock: formData.occupancy ?? formData.currentStock,
        utilization: formData.capacity ? Math.round(((formData.occupancy ?? formData.currentStock) / formData.capacity) * 100) : 0
      };
      onSave(newBinRack);
      onClose();
    }
  };


  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <FormControl fullWidth error={!!errors.warehouseName}>
            <InputLabel>Warehouse Name</InputLabel>
            <Select
              value={formData.warehouseName}
              onChange={(e) => handleInputChange('warehouseName', e.target.value)}
              label="Warehouse Name"
              required
            >
              <MenuItem value="">
                <em>Select warehouse</em>
              </MenuItem>
              {(warehouses || []).map((w) => (
                <MenuItem key={w.id || w.warehouseId} value={w.warehouseName || w.name}>
                  {w.warehouseName || w.name}
                </MenuItem>
              ))}
            </Select>
            {errors.warehouseName && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.warehouseName}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Zone</InputLabel>
            <Select
              value={formData.zone}
              onChange={(e) => handleInputChange('zone', e.target.value)}
              label="Zone"
              error={!!errors.zone}
              required
            >
              <MenuItem value="Zone A">Zone A</MenuItem>
              <MenuItem value="Zone B">Zone B</MenuItem>
              <MenuItem value="Zone C">Zone C</MenuItem>
              <MenuItem value="Zone D">Zone D</MenuItem>
              <MenuItem value="Zone E">Zone E</MenuItem>
              <MenuItem value="Cold Storage">Cold Storage</MenuItem>
              <MenuItem value="Hazardous">Hazardous</MenuItem>
              <MenuItem value="Bulk Storage">Bulk Storage</MenuItem>
              <MenuItem value="Pick & Pack">Pick & Pack</MenuItem>
            </Select>
            {errors.zone && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.zone}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Bin/Rack Number"
            value={formData.binRackNumber}
            onChange={(e) => handleInputChange('binRackNumber', e.target.value)}
            error={!!errors.binRackNumber}
            helperText={errors.binRackNumber}
            required
            placeholder="e.g., BR001, RACK-A1"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Bin Type</InputLabel>
            <Select
              value={formData.binType}
              onChange={(e) => handleInputChange('binType', e.target.value)}
              label="Bin Type"
              error={!!errors.binType}
              required
            >
              <MenuItem value="Pallet Bin">Pallet Bin</MenuItem>
              <MenuItem value="Shelf Bin">Shelf Bin</MenuItem>
              <MenuItem value="Bulk Bin">Bulk Bin</MenuItem>
              <MenuItem value="Carton Bin">Carton Bin</MenuItem>
              <MenuItem value="Small Parts Bin">Small Parts Bin</MenuItem>
              <MenuItem value="Cold Storage Bin">Cold Storage Bin</MenuItem>
              <MenuItem value="Hazardous Bin">Hazardous Bin</MenuItem>
              <MenuItem value="Floor Bin">Floor Bin</MenuItem>
            </Select>
            {errors.binType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.binType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Location Code"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            placeholder="e.g., A-1-1"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <FormControl fullWidth error={!!errors.productCategory}>
            <InputLabel>Product Category</InputLabel>
            <Select
              value={formData.productCategory}
              onChange={(e) => handleInputChange('productCategory', e.target.value)}
              label="Product Category"
              required
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Furniture">Furniture</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Food & Beverages">Food & Beverages</MenuItem>
              <MenuItem value="Pharmaceuticals">Pharmaceuticals</MenuItem>
              <MenuItem value="Automotive">Automotive</MenuItem>
              <MenuItem value="Books & Media">Books & Media</MenuItem>
              <MenuItem value="Home & Garden">Home & Garden</MenuItem>
            </Select>
            {errors.productCategory && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                {errors.productCategory}
              </Typography>
            )}
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Total Capacity"
            type="number"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            error={!!errors.capacity}
            helperText={errors.capacity}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Occupancy (kg)"
            type="number"
            value={formData.occupancy}
            onChange={(e) => handleInputChange('occupancy', e.target.value)}
            placeholder="Enter weight in kg"
          />
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

export default CreateBinRack;
