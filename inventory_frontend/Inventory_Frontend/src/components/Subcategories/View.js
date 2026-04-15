'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import { getCategories } from '../../app/item/sharedData';

const ViewSubcategory = ({ subcategoryData, onClose, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.categoryName : 'Unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Subcategory ID
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {subcategoryData?.id}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Status
          </Typography>
          <Chip 
            label={subcategoryData?.status} 
            color={getStatusColor(subcategoryData?.status)}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Category
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {getCategoryName(subcategoryData?.categoryId)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Subcategory Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {subcategoryData?.subCategoryName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1">
            {subcategoryData?.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewSubcategory;
