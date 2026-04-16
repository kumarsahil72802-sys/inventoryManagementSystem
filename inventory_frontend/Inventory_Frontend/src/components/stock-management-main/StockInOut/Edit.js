"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

const EditStockInOut = ({ stockData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: "",
    skuCode: "",
    warehouseName: "",
    currentStock: "",
    availableStock: "",
    unitPrice: "",
    batchNumber: "",
    status: "In Stock"
  });

  const stockStatuses = [
    "In Stock",
    "Low Stock",
    "Out of Stock"
  ];

  const warehouses = [
    "Electronics Warehouse",
    "Furniture Warehouse",
    "Clothing Warehouse",
    "Food Warehouse"
  ];

  useEffect(() => {
    if (stockData) {
      setFormData({
        productName: stockData.productName || "",
        skuCode: stockData.skuCode || "",
        warehouseName: stockData.warehouseName || "",
        currentStock: stockData.currentStock || "",
        availableStock: stockData.availableStock || "",
        unitPrice: stockData.unitPrice || "",
        batchNumber: stockData.batchNumber || "",
        status: stockData.status || "In Stock"
      });
    }
  }, [stockData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
          placeholder="Enter product name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="SKU Code"
          name="skuCode"
          value={formData.skuCode}
          onChange={handleChange}
          required
          placeholder="Enter SKU code"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouseName"
            value={formData.warehouseName}
            onChange={handleChange}
            label="Warehouse"
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse} value={warehouse}>
                {warehouse}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Current Stock"
          name="currentStock"
          type="number"
          value={formData.currentStock}
          onChange={handleChange}
          required
          placeholder="Enter current stock"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Available Stock"
          name="availableStock"
          type="number"
          value={formData.availableStock}
          onChange={handleChange}
          required
          placeholder="Enter available stock"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Unit Price"
          name="unitPrice"
          type="number"
          value={formData.unitPrice}
          onChange={handleChange}
          required
          placeholder="Enter unit price"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Batch Number"
          name="batchNumber"
          value={formData.batchNumber}
          onChange={handleChange}
          required
          placeholder="Enter batch number"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth required>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            {stockStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            transform: 'none', 
            textTransform: 'none' 
          }}
        >
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditStockInOut;
