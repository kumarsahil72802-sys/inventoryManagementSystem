"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, IconButton, Box, Divider } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useState, useEffect } from "react";

const EditStockTransfer = ({ transferData, onClose, onSave, items = [], warehouses = [], loading = false }) => {
  const [formData, setFormData] = useState({
    fromWarehouseId: "", toWarehouseId: "",
    transferDate: "", expectedDeliveryDate: "",
    reason: "", notes: "", status: "Pending",
  });
  const [transferItems, setTransferItems] = useState([
    { itemId: "", quantity: "", unit: "Pieces", costPrice: "" }
  ]);

  useEffect(() => {
    if (transferData) {
      setFormData({
        fromWarehouseId: transferData.fromWarehouseId || "",
        toWarehouseId: transferData.toWarehouseId || "",
        transferDate: transferData.transferDate || "",
        expectedDeliveryDate: transferData.expectedDeliveryDate || "",
        reason: transferData.reason !== '—' ? (transferData.reason || "") : "",
        notes: transferData.notes || "",
        status: transferData.status || "Pending",
      });
      if (transferData.items?.length > 0) {
        setTransferItems(transferData.items.map(i => ({
          itemId: i.itemId?._id || i.itemId || "",
          quantity: i.quantity || "",
          unit: i.unit || "Pieces",
          costPrice: i.costPrice || "",
        })));
      }
    }
  }, [transferData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...transferItems];
    updated[index] = { ...updated[index], [name]: value };
    setTransferItems(updated);
  };

  const addItem = () => setTransferItems([...transferItems, { itemId: "", quantity: "", unit: "Pieces", costPrice: "" }]);
  const removeItem = (index) => { if (transferItems.length > 1) setTransferItems(transferItems.filter((_, i) => i !== index)); };

  const handleSave = () => {
    if (!formData.fromWarehouseId || !formData.toWarehouseId) { alert("Please select warehouses."); return; }
    const validItems = transferItems.filter(i => i.itemId && i.quantity);
    if (validItems.length === 0) { alert("Please add at least one item."); return; }
    if (onSave) onSave({ ...formData, items: validItems });
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>From Warehouse</InputLabel>
          <Select name="fromWarehouseId" value={formData.fromWarehouseId} onChange={handleChange} label="From Warehouse">
            {Array.isArray(warehouses) && warehouses.map(wh => <MenuItem key={wh.id} value={wh.id}>{wh.warehouseName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>To Warehouse</InputLabel>
          <Select name="toWarehouseId" value={formData.toWarehouseId} onChange={handleChange} label="To Warehouse">
            {Array.isArray(warehouses) && warehouses.map(wh => <MenuItem key={wh.id} value={wh.id}>{wh.warehouseName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Transfer Date" name="transferDate" type="date"
          value={formData.transferDate} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Expected Delivery Date" name="expectedDeliveryDate" type="date"
          value={formData.expectedDeliveryDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Reason" name="reason" value={formData.reason} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={formData.status} onChange={handleChange} label="Status">
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Transit">In Transit</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Transfer Items</Typography>
          <Button size="small" startIcon={<Add />} onClick={addItem} variant="outlined">Add Item</Button>
        </Box>
        {transferItems.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
            <FormControl sx={{ flex: 2 }} required size="small">
              <InputLabel>Item</InputLabel>
              <Select name="itemId" value={item.itemId} onChange={(e) => handleItemChange(index, e)} label="Item">
                {Array.isArray(items) && items.map(i => <MenuItem key={i.id} value={i.id}>{i.productName}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField sx={{ flex: 1 }} label="Qty" name="quantity" type="number" size="small"
              value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
            <TextField sx={{ flex: 1 }} label="Unit" name="unit" size="small"
              value={item.unit} onChange={(e) => handleItemChange(index, e)} />
            <TextField sx={{ flex: 1 }} label="Cost/Unit" name="costPrice" type="number" size="small"
              value={item.costPrice} onChange={(e) => handleItemChange(index, e)} />
            <IconButton onClick={() => removeItem(index)} size="small" color="error" disabled={transferItems.length === 1}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField fullWidth label="Notes" name="notes" value={formData.notes} onChange={handleChange} multiline rows={2} />
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: 'none' }} disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" disabled={loading}
          sx={{ backgroundColor: '#1976D2', '&:hover': { backgroundColor: '#1565C0' }, textTransform: 'none' }}>
          {loading ? <CircularProgress size={22} color="inherit" /> : 'Update'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditStockTransfer;
