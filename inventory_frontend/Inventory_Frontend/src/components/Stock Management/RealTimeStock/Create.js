"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState } from "react";

const CreateRealTimeStock = ({ onClose, onSave, items = [], warehouses = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemId: "", warehouseId: "",
    currentStock: "", availableStock: "", reservedStock: "0",
    movement: "", movementQuantity: "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.itemId || !formData.warehouseId || formData.currentStock === "") {
      alert("Please fill all required fields.");
      return;
    }
    if (onSave) onSave(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Item / Product</InputLabel>
          <Select name="itemId" value={formData.itemId} onChange={handleChange} label="Item / Product">
            {items.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.productName} {item.skuCode ? `(${item.skuCode})` : ''}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Warehouse</InputLabel>
          <Select name="warehouseId" value={formData.warehouseId} onChange={handleChange} label="Warehouse">
            {warehouses.map(wh => <MenuItem key={wh.id} value={wh.id}>{wh.warehouseName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Current Stock" name="currentStock" type="number"
          value={formData.currentStock} onChange={handleChange} required placeholder="0" />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Available Stock" name="availableStock" type="number"
          value={formData.availableStock} onChange={handleChange} required placeholder="0" />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Reserved Stock" name="reservedStock" type="number"
          value={formData.reservedStock} onChange={handleChange} placeholder="0" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Last Movement Type</InputLabel>
          <Select name="movement" value={formData.movement} onChange={handleChange} label="Last Movement Type">
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Stock In">Stock In</MenuItem>
            <MenuItem value="Stock Out">Stock Out</MenuItem>
            <MenuItem value="Stock Transfer">Stock Transfer</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Movement Quantity" name="movementQuantity" type="number"
          value={formData.movementQuantity} onChange={handleChange} placeholder="0" />
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}
          sx={{ backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' }, textTransform: 'none' }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Save'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateRealTimeStock;
