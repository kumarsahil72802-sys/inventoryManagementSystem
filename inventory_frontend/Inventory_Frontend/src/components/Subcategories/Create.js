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
const CreateSubcategory = ({ onClose, onSave, categories = [] }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    subCategoryName: '',
    description: ''
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
    
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';
    if (!formData.subCategoryName.trim()) newErrors.subCategoryName = 'Subcategory name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const newSubcategory = {
        ...formData,
        id: `SUB${String(Date.now()).slice(-3)}`,
        status: 'Active',
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      onSave(newSubcategory);
      onClose();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              label="Category"
              error={!!errors.categoryId}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.categoryName || category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errors.categoryId && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
              {errors.categoryId}
            </Typography>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Subcategory Name"
            value={formData.subCategoryName}
            onChange={(e) => handleInputChange('subCategoryName', e.target.value)}
            error={!!errors.subCategoryName}
            helperText={errors.subCategoryName}
            required
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
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

export default CreateSubcategory;
