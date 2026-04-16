"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState } from "react";

const CreateOpeningStock = ({ onClose, onSave, items = [], warehouses = [], suppliers = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemId: "", warehouseId: "", supplierId: "",
    openingQuantity: "", unitPrice: "",
    openingDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.itemId || !formData.warehouseId || !formData.openingQuantity || !formData.unitPrice) {
      alert("Please fill all required fields.");
      return;
    }
    const totalValue = Number(formData.openingQuantity) * Number(formData.unitPrice);
    if (onSave) onSave({ ...formData, totalValue });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Item / Product</InputLabel>
          <Select name="itemId" value={formData.itemId} onChange={handleChange} label="Item / Product">
            {Array.isArray(items) && items.map(item => (
              <MenuItem key={item.id} value={item.id}>{item.productName} {item.skuCode ? `(${item.skuCode})` : ''}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Warehouse</InputLabel>
          <Select name="warehouseId" value={formData.warehouseId} onChange={handleChange} label="Warehouse">
            {Array.isArray(warehouses) && warehouses.map(wh => <MenuItem key={wh.id} value={wh.id}>{wh.warehouseName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Supplier</InputLabel>
          <Select name="supplierId" value={formData.supplierId} onChange={handleChange} label="Supplier">
            <MenuItem value=""><em>None</em></MenuItem>
            {Array.isArray(suppliers) && suppliers.map(sup => <MenuItem key={sup.id} value={sup.id}>{sup.supplierName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Opening Quantity" name="openingQuantity" type="number"
          value={formData.openingQuantity} onChange={handleChange} required placeholder="Enter opening quantity" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Unit Price (₹)" name="unitPrice" type="number"
          value={formData.unitPrice} onChange={handleChange} required placeholder="Enter unit price" />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Opening Date" name="openingDate" type="date"
          value={formData.openingDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
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

export default CreateOpeningStock;
