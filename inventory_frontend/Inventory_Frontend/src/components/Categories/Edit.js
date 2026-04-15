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
} from "@mui/material";

const EditCategory = ({ categoryData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    description: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoryData) {
      setFormData({
        categoryName: categoryData.categoryName || '',
        description: categoryData.description || '',
        status: categoryData.status || 'Active'
      });
    }
  }, [categoryData]);

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
    
    if (!formData.categoryName.trim()) newErrors.categoryName = 'Category name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const updatedCategory = {
        ...categoryData,
        ...formData,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onSave(updatedCategory);
      onClose();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Category Name"
            value={formData.categoryName}
            onChange={(e) => handleInputChange('categoryName', e.target.value)}
            error={!!errors.categoryName}
            helperText={errors.categoryName}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            error={!!errors.description}
            helperText={errors.description}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
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
          sx={{ 
            transform: 'none', 
            textTransform: 'none',
            color: '#1976D2',
            borderColor: '#1976D2',
            '&:hover': {
              borderColor: '#1565C0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ 
            transform: 'none', 
            textTransform: 'none',
            backgroundColor: '#1976D2',
            '&:hover': {
              backgroundColor: '#1565C0'
            }
          }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategory;
