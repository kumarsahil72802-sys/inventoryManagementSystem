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
import { Cancel, Edit, Delete } from "@mui/icons-material";

const ViewSetup = ({ warehouse, handleClose }) => {
  const renderViewContent = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Warehouse ID:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.warehouseId || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Location:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.location || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              City:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.city || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Contact Person:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.contactPerson || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Operating Hours:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.operatingHours || 'N/A'}
            </Typography>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Warehouse Name:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.warehouseName || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Warehouse Type:
            </Typography>
            <Chip 
              label={warehouse?.warehouseType || 'N/A'} 
              color={warehouse?.warehouseType === 'Main' ? 'primary' : 'secondary'}
              size="small"
              sx={{ fontSize: '0.9rem' }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Phone:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.phone || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Email:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {warehouse?.email || 'N/A'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>
              Status:
            </Typography>
            <Chip 
              label={warehouse?.status || 'N/A'} 
              color={warehouse?.status === 'Active' ? 'success' : 'error'}
              size="small"
              sx={{ fontSize: '0.9rem' }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  return renderViewContent();
};

export default ViewSetup;
