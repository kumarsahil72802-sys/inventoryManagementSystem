"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const EditBatch = ({ batchData, onClose, onSave, items = [], warehouses = [], suppliers = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemId: "",
    batchNumber: "",
    warehouseId: "",
    quantity: "",
    availableQuantity: "",
    purchaseDate: "",
    expiryDate: "",
    supplierId: "",
    purchasePrice: "",
    sellingPrice: "",
    costPrice: "",
    status: "Active"
  });

  useEffect(() => {
    if (batchData) {
      setFormData({
        itemId: batchData.itemId || "",
        batchNumber: batchData.batchNumber || "",
        warehouseId: batchData.warehouseId || "",
        quantity: batchData.quantity || "",
        availableQuantity: batchData.availableQuantity || "",
        purchaseDate: batchData.purchaseDate ? new Date(batchData.purchaseDate).toISOString().split('T')[0] : "",
        expiryDate: batchData.expiryDate ? new Date(batchData.expiryDate).toISOString().split('T')[0] : "",
        supplierId: batchData.supplierId || "",
        purchasePrice: batchData.purchasePrice || "",
        sellingPrice: batchData.sellingPrice || "",
        costPrice: batchData.costPrice || "",
        status: batchData.status || "Active"
      });
    }
  }, [batchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.itemId || !formData.batchNumber || !formData.warehouseId || !formData.quantity || !formData.purchaseDate || !formData.purchasePrice || !formData.sellingPrice || !formData.costPrice) {
      alert("Please fill all required fields.");
      return;
    }
    if (onSave) onSave(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Product / Item</InputLabel>
          <Select name="itemId" value={formData.itemId} onChange={handleChange} label="Product / Item">
            {Array.isArray(items) && items.map(item => <MenuItem key={item.id} value={item.id}>{item.productName} {item.skuCode ? `(${item.skuCode})` : ''}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required placeholder="Enter batch number" />
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
        <TextField fullWidth label="Total Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Available Quantity" name="availableQuantity" type="number" value={formData.availableQuantity} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Purchase Price (₹)" name="purchasePrice" type="number" value={formData.purchasePrice} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Cost Price (₹)" name="costPrice" type="number" value={formData.costPrice} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Selling Price (₹)" name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Purchase Date" name="purchaseDate" type="date" value={formData.purchaseDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={formData.status} onChange={handleChange} label="Status">
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Depleted">Depleted</MenuItem>
            <MenuItem value="Expired">Expired</MenuItem>
            <MenuItem value="Damaged">Damaged</MenuItem>
            <MenuItem value="Returned">Returned</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading} sx={{ backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' }, textTransform: 'none' }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Save Changes'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditBatch;
