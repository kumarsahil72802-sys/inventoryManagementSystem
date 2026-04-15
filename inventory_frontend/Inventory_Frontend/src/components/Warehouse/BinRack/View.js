'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  Chip,
} from "@mui/material";

const ViewBinRack = ({ onClose, binRackData, onEdit, onDelete }) => {

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Warehouse Name:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.warehouseName || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Zone:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.zone || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Bin/Rack Number:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.binRackNumber || binRackData?.binNumber || binRackData?.rackNumber || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Bin Type:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={binRackData?.binType || 'N/A'} 
              color="primary"
              size="small"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Location Code:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.location || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Product Category:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={binRackData?.productCategory || 'N/A'} 
              color="primary"
              size="small"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Total Capacity:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.capacity || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Occupancy (kg):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {binRackData?.occupancy || binRackData?.currentStock || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Utilization:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 600, 
              mb: 2,
              color: binRackData?.utilization >= 90 ? '#d32f2f' : binRackData?.utilization >= 75 ? '#ed6c02' : '#2e7d32'
            }}
          >
            {binRackData?.utilization || 0}%
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Status:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={binRackData?.status || 'N/A'} 
              color={binRackData?.status === 'Active' ? 'success' : binRackData?.status === 'Maintenance' ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        </Grid>

      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onEdit(binRackData)}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(binRackData)}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default ViewBinRack;
