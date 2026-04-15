'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
} from "@mui/material";
const CreateCapacity = ({ warehouses = [], handleCreate, handleClose }) => {
  const [formData, setFormData] = useState({
    warehouseName: '',
    totalZonesInWarehouse: '',
    totalCapacityUnits: '',
    totalCapacityVolume: '',
    totalCapacityWeight: '',
    availableCapacityVolume: '',
    availableCapacityWeight: '',
    reservedCapacity: '',
    utilizationPercent: 0,
    throughputCapacity: '',
    status: 'Good',
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const [zoneData, setZoneData] = useState({});

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

    // If totalZonesInWarehouse changes, update zoneData
    if (field === 'totalZonesInWarehouse') {
      const numZones = parseInt(value) || 0;
      const newZoneData = {};
      for (let i = 1; i <= numZones; i++) {
        const zoneName = String.fromCharCode(64 + i); // A, B, C, D, E...
        newZoneData[`zone_${zoneName}`] = {
          zoneName: `Zone ${zoneName}`,
          bins: ''
        };
      }
      setZoneData(newZoneData);
    }
  };

  const handleZoneChange = (zoneKey, field, value) => {
    setZoneData(prev => ({
      ...prev,
      [zoneKey]: {
        ...prev[zoneKey],
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.warehouseName.trim()) newErrors.warehouseName = 'Warehouse name is required';
    if (!formData.totalZonesInWarehouse || formData.totalZonesInWarehouse <= 0) newErrors.totalZonesInWarehouse = 'Valid number of zones is required';
    if (!formData.totalCapacityUnits || formData.totalCapacityUnits <= 0) newErrors.totalCapacityUnits = 'Valid total capacity units is required';
    if (!formData.totalCapacityVolume || formData.totalCapacityVolume <= 0) newErrors.totalCapacityVolume = 'Valid total capacity volume is required';
    if (!formData.throughputCapacity || formData.throughputCapacity <= 0) newErrors.throughputCapacity = 'Valid throughput capacity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const utilizationPercent = formData.availableCapacityVolume ? 
        Math.round(((formData.totalCapacityVolume - formData.availableCapacityVolume) / formData.totalCapacityVolume) * 100) : 0;
      
      const wh = warehouses.find(w => (w.warehouseName || w.name) === formData.warehouseName);
      const warehouseId = wh?.id || wh?.warehouseId;
      const newCapacity = {
        ...formData,
        warehouseId,
        utilizationPercent: utilizationPercent,
        zoneData: zoneData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      handleCreate(newCapacity);
      handleClose();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Warehouse Name</InputLabel>
            <Select
              value={formData.warehouseName}
              onChange={(e) => handleInputChange('warehouseName', e.target.value)}
              label="Warehouse Name"
              error={!!errors.warehouseName}
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
          <TextField
            fullWidth
            label="Number of Zones"
            type="number"
            value={formData.totalZonesInWarehouse}
            onChange={(e) => handleInputChange('totalZonesInWarehouse', e.target.value)}
            error={!!errors.totalZonesInWarehouse}
            helperText={errors.totalZonesInWarehouse}
            required
            placeholder="e.g., 5 (will create Zone A, B, C, D, E)"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Total Capacity Units"
            type="number"
            value={formData.totalCapacityUnits}
            onChange={(e) => handleInputChange('totalCapacityUnits', e.target.value)}
            error={!!errors.totalCapacityUnits}
            helperText={errors.totalCapacityUnits}
            required
            placeholder="pallets / bins"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Total Capacity Volume (m³)"
            type="number"
            value={formData.totalCapacityVolume}
            onChange={(e) => handleInputChange('totalCapacityVolume', e.target.value)}
            error={!!errors.totalCapacityVolume}
            helperText={errors.totalCapacityVolume}
            required
            placeholder="cubic meters"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Total Capacity Weight (kg)"
            type="number"
            value={formData.totalCapacityWeight}
            onChange={(e) => handleInputChange('totalCapacityWeight', e.target.value)}
            placeholder="kg / tons"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Available Capacity Volume (m³)"
            type="number"
            value={formData.availableCapacityVolume}
            onChange={(e) => handleInputChange('availableCapacityVolume', e.target.value)}
            placeholder="available cubic meters"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Available Capacity Weight (kg)"
            type="number"
            value={formData.availableCapacityWeight}
            onChange={(e) => handleInputChange('availableCapacityWeight', e.target.value)}
            placeholder="available kg / tons"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Reserved Capacity"
            type="number"
            value={formData.reservedCapacity}
            onChange={(e) => handleInputChange('reservedCapacity', e.target.value)}
            placeholder="incoming stock reserved space"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Throughput Capacity (orders/day)"
            type="number"
            value={formData.throughputCapacity}
            onChange={(e) => handleInputChange('throughputCapacity', e.target.value)}
            error={!!errors.throughputCapacity}
            helperText={errors.throughputCapacity}
            required
            placeholder="orders handled per day"
          />
        </Grid>


        {/* Dynamic Zone Fields */}
        {Object.keys(zoneData).length > 0 && (
          <>
            <Grid size={12} sx={{ mb: 2, mt: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#1976D2' }}>
                Zone-wise Bin Configuration
              </Typography>
            </Grid>
            {Object.entries(zoneData).map(([zoneKey, zone]) => (
              <Grid key={zoneKey} size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label={`${zone.zoneName} - Number of Bins`}
                  type="number"
                  value={zone.bins}
                  onChange={(e) => handleZoneChange(zoneKey, 'bins', e.target.value)}
                  placeholder={`Enter bins for ${zone.zoneName}`}
                />
              </Grid>
            ))}
          </>
        )}

      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
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

export default CreateCapacity;
