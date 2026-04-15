'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
  Alert,
} from "@mui/material";

const DeleteBinRack = ({ onClose, binRackData, onConfirm }) => {
  const handleDelete = () => {
    onConfirm(binRackData.id);
    onClose();
  };


  return (
    <Box sx={{ p: 2 }}>
      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Warning!
        </Typography>
        <Typography variant="body2">
          You are about to permanently delete this bin/rack configuration and all its associated data.
        </Typography>
      </Alert>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#d32f2f' }}>
          Bin/Rack Details to be Deleted:
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          border: '1px solid #e0e0e0', 
          borderRadius: 1, 
          backgroundColor: '#fafafa' 
        }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Warehouse:</strong> {binRackData?.warehouseName || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Zone:</strong> {binRackData?.zone || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Rack Number:</strong> {binRackData?.rackNumber || binRackData?.binRackNumber || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Bin Number:</strong> {binRackData?.binId || binRackData?.binNumber || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Location Code:</strong> {binRackData?.location || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Product Category:</strong> {binRackData?.productCategory || 'N/A'}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Capacity:</strong> {binRackData?.capacity || 'N/A'} units
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Current Stock:</strong> {binRackData?.currentStock || 'N/A'} units
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Utilization:</strong> {binRackData?.utilization || 0}%
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Status:</strong> {binRackData?.status || 'N/A'}
          </Typography>
        </Box>
      </Box>

      <Alert severity="error" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Impact of deletion:</strong>
        </Typography>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li>Bin/rack configuration will be permanently removed</li>
          <li>Associated inventory data will be lost</li>
          <li>Location tracking will be affected</li>
          <li>Capacity planning data will be updated</li>
        </ul>
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteBinRack;
