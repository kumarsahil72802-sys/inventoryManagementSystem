'use client';

import React from 'react';
import {
  Box,
  Button,
  Typography,
} from "@mui/material";

const DeleteCategory = ({ categoryData, onClose, onDelete, saving }) => {
  const handleDelete = async () => {
    if (!categoryData?.id) return;
    await onDelete(categoryData.id);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Are you sure you want to delete the category &quot;{categoryData?.categoryName}&quot;?
      </Typography>

      {/* Action Buttons */}
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
          disabled={saving}
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          {saving ? "Deleting..." : "Delete"}
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteCategory;
