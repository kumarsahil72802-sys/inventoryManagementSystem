'use client';

import React, { useState, useEffect } from 'react';
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
  Snackbar,
} from "@mui/material";
// Icons removed as per requirements
import CommonDialog from '../../CommonDialog';

const EditSetup = ({ warehouse, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    warehouseName: '',
    warehouseType: 'Main',
    location: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    contactPerson: '',
    phone: '',
    email: '',
    capacity: '',
    currentStock: '',
    zones: '',
    racks: '',
    bins: '',
    employees: '',
    operatingHours: '24/7',
    temperature: 'Controlled',
    securityLevel: 'High',
    automationLevel: 'Semi-Automated',
    status: 'Active',
    establishedDate: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    energyEfficiency: '',
    safetyScore: '',
    productivityIndex: '',
    costPerUnit: '',
    revenue: '',
    profit: '',
    lastAudit: '',
    nextAudit: '',
    complianceStatus: 'Compliant'
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (warehouse) {
      setFormData({
        warehouseName: warehouse.warehouseName || '',
        shortCode: warehouse.shortCode || warehouse.code || '',
        warehouseType: warehouse.warehouseType || 'Primary',
        location: warehouse.city || warehouse.location || '',
        address: warehouse.addressLine1 || warehouse.address || '',
        city: warehouse.city || '',
        state: warehouse.state || '',
        pincode: warehouse.pincode || '',
        contactPerson: warehouse.contactPerson || '',
        phone: warehouse.contactPhone || '',
        email: warehouse.contactEmail || '',
        capacity: warehouse.capacity || '',
        currentStock: warehouse.currentStock || '',
        zones: warehouse.zones || '',
        racks: warehouse.racks || '',
        bins: warehouse.bins || '',
        employees: warehouse.employees || '',
        operatingHours: warehouse.operatingHours || '24/7',
        temperature: warehouse.temperature || 'Controlled',
        securityLevel: warehouse.securityLevel || 'High',
        automationLevel: warehouse.automationLevel || 'Semi-Automated',
        status: warehouse.status || 'Active',
        establishedDate: warehouse.establishedDate || '',
        lastUpdated: new Date().toISOString().split('T')[0],
        energyEfficiency: warehouse.energyEfficiency || '',
        safetyScore: warehouse.safetyScore || '',
        productivityIndex: warehouse.productivityIndex || '',
        costPerUnit: warehouse.costPerUnit || '',
        revenue: warehouse.revenue || '',
        profit: warehouse.profit || '',
        lastAudit: warehouse.lastAudit || '',
        nextAudit: warehouse.nextAudit || '',
        complianceStatus: warehouse.complianceStatus || 'Compliant'
      });
    }
  }, [warehouse]);

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
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.capacity || formData.capacity <= 0) newErrors.capacity = 'Valid capacity is required';
    if (!formData.establishedDate) newErrors.establishedDate = 'Established date is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const updatedWarehouse = {
        ...formData,
        utilization: Math.round((formData.currentStock / formData.capacity) * 100),
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      handleUpdate(updatedWarehouse);
      setSnackbar({
        open: true,
        message: 'Warehouse updated successfully!',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Please fix the errors before saving',
        severity: 'error'
      });
    }
  };

  const renderFormContent = () => (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976D2' }}>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Warehouse Name"
            value={formData.warehouseName}
            onChange={(e) => handleInputChange('warehouseName', e.target.value)}
            error={!!errors.warehouseName}
            helperText={errors.warehouseName}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Warehouse Type</InputLabel>
            <Select
              value={formData.warehouseType || 'Primary'}
              onChange={(e) => handleInputChange('warehouseType', e.target.value)}
              label="Warehouse Type"
            >
              <MenuItem value="Primary">Primary</MenuItem>
              <MenuItem value="Secondary">Secondary</MenuItem>
              <MenuItem value="Cold Storage">Cold Storage</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={!!errors.address}
            helperText={errors.address}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="City"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="State"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            error={!!errors.pincode}
            helperText={errors.pincode}
            required
          />
        </Grid>

        {/* Contact Information */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', mt: 2 }}>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Contact Person"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
            error={!!errors.contactPerson}
            helperText={errors.contactPerson}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={!!errors.phone}
            helperText={errors.phone}
            required
          />
        </Grid>

        <Grid size={12}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
          />
        </Grid>

        {/* Capacity Information */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', mt: 2 }}>
            Capacity Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
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

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Current Stock"
            type="number"
            value={formData.currentStock}
            onChange={(e) => handleInputChange('currentStock', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Zones"
            type="number"
            value={formData.zones}
            onChange={(e) => handleInputChange('zones', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Racks"
            type="number"
            value={formData.racks}
            onChange={(e) => handleInputChange('racks', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Bins"
            type="number"
            value={formData.bins}
            onChange={(e) => handleInputChange('bins', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Employees"
            type="number"
            value={formData.employees}
            onChange={(e) => handleInputChange('employees', e.target.value)}
          />
        </Grid>

        {/* Operational Information */}
        <Grid size={12}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1976D2', mt: 2 }}>
            Operational Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Operating Hours</InputLabel>
            <Select
              value={formData.operatingHours || '24/7'}
              onChange={(e) => handleInputChange('operatingHours', e.target.value)}
              label="Operating Hours"
            >
              <MenuItem value="24/7">24/7</MenuItem>
              <MenuItem value="16/7">16/7</MenuItem>
              <MenuItem value="12/7">12/7</MenuItem>
              <MenuItem value="8/5">8/5</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Temperature Control</InputLabel>
            <Select
              value={formData.temperature || 'Controlled'}
              onChange={(e) => handleInputChange('temperature', e.target.value)}
              label="Temperature Control"
            >
              <MenuItem value="Controlled">Controlled</MenuItem>
              <MenuItem value="Climate Controlled">Climate Controlled</MenuItem>
              <MenuItem value="Ambient">Ambient</MenuItem>
              <MenuItem value="Cold Storage">Cold Storage</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Security Level</InputLabel>
            <Select
              value={formData.securityLevel || 'High'}
              onChange={(e) => handleInputChange('securityLevel', e.target.value)}
              label="Security Level"
            >
              <MenuItem value="Very High">Very High</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Automation Level</InputLabel>
            <Select
              value={formData.automationLevel || 'Semi-Automated'}
              onChange={(e) => handleInputChange('automationLevel', e.target.value)}
              label="Automation Level"
            >
              <MenuItem value="Fully Automated">Fully Automated</MenuItem>
              <MenuItem value="Semi-Automated">Semi-Automated</MenuItem>
              <MenuItem value="Manual">Manual</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Established Date"
            type="date"
            value={formData.establishedDate}
            onChange={(e) => handleInputChange('establishedDate', e.target.value)}
            error={!!errors.establishedDate}
            helperText={errors.establishedDate}
            required
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status || 'Active'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
          Update Warehouse
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {renderFormContent()}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </>
  );
};

export default EditSetup;
