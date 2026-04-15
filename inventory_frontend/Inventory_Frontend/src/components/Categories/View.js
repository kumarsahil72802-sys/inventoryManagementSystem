'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewCategory = ({ categoryData, onClose, onEdit, onDelete }) => {
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
            Category ID
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {categoryData?.id}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Status
          </Typography>
          <Chip 
            label={categoryData?.status} 
            color={getStatusColor(categoryData?.status)}
            size="small"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Category Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {categoryData?.categoryName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1">
            {categoryData?.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCategory;
