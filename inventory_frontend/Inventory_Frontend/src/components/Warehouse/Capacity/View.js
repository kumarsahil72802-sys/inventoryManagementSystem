'use client';

import React from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  Chip,
} from "@mui/material";

const ViewCapacity = ({ capacity, handleClose }) => {
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Warehouse Name:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.warehouseName || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Number of Zones:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.totalZonesInWarehouse || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Total Capacity Units:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.totalCapacityUnits || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Total Capacity Volume (m³):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.totalCapacityVolume || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Total Capacity Weight (kg):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.totalCapacityWeight || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Available Capacity Volume (m³):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.availableCapacityVolume || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Available Capacity Weight (kg):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.availableCapacityWeight || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Reserved Capacity:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.reservedCapacity || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Throughput Capacity (orders/day):
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.throughputCapacity || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Status:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={capacity?.status || 'N/A'} 
              color={capacity?.status === 'Optimal' ? 'success' : 
                     capacity?.status === 'Good' ? 'primary' : 
                     capacity?.status === 'Warning' ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Zone-wise Bins:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.zoneBins || 'N/A'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Utilization %:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.utilizationPercent || 'N/A'}%
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Status:
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Chip 
              label={capacity?.status || 'N/A'} 
              color={capacity?.status === 'Optimal' ? 'success' : 
                     capacity?.status === 'Good' ? 'primary' : 
                     capacity?.status === 'Warning' ? 'warning' : 'error'}
              size="small"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 2 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
            Last Updated:
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>
            {capacity?.lastUpdated || 'N/A'}
          </Typography>
        </Grid>

      </Grid>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={handleClose}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};

export default ViewCapacity;