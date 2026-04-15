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
  Snackbar,
} from "@mui/material";

const CreateSetup = ({ handleCreate, handleClose }) => {
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
    operatingHours: '24/7',
    temperature: 'Controlled',
    securityLevel: 'High',
    automationLevel: 'Semi-Automated',
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
      const newWarehouse = {
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      handleCreate(newWarehouse);
      setSnackbar({
        open: true,
        message: 'Warehouse created successfully!',
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

  return (
    <>
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
                value={formData.warehouseType}
                onChange={(e) => handleInputChange('warehouseType', e.target.value)}
                label="Warehouse Type"
              >
                <MenuItem value="Main">Main</MenuItem>
                <MenuItem value="Specialized">Specialized</MenuItem>
                <MenuItem value="Distribution">Distribution</MenuItem>
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
                value={formData.operatingHours}
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
                value={formData.temperature}
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
                value={formData.securityLevel}
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
                value={formData.automationLevel}
                onChange={(e) => handleInputChange('automationLevel', e.target.value)}
                label="Automation Level"
              >
                <MenuItem value="Fully Automated">Fully Automated</MenuItem>
                <MenuItem value="Semi-Automated">Semi-Automated</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={12}>
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </>
  );
};

export default CreateSetup;
