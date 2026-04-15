"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const EditStockOut = ({ stockData, onClose, onSave, items = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemId: "", quantityOut: "", perPiecePrice: "", totalCost: "",
    invoice: "", dateOfStockOut: "", paymentStatus: "pending"
  });

  useEffect(() => {
    if (stockData) {
      setFormData({
        itemId: stockData.itemId || "",
        quantityOut: stockData.quantityOut || stockData.quantity || "",
        perPiecePrice: stockData.perPiecePrice || "",
        totalCost: stockData.totalCost || stockData.totalSale || "",
        invoice: stockData.invoice !== '—' ? (stockData.invoice || "") : "",
        dateOfStockOut: stockData.dateOfStockOut || stockData.entryDate || "",
        paymentStatus: (stockData.paymentStatus || "pending").toLowerCase(),
      });
    }
  }, [stockData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "quantityOut" || name === "perPiecePrice") {
      const qty = name === "quantityOut" ? value : formData.quantityOut;
      const price = name === "perPiecePrice" ? value : formData.perPiecePrice;
      if (qty && price) updated.totalCost = (parseFloat(qty) * parseFloat(price)).toFixed(2);
    }
    setFormData(updated);
  };

  const handleSave = () => {
    if (!formData.itemId || !formData.quantityOut) { alert("Please fill required fields."); return; }
    if (onSave) onSave(formData);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Item / Product</InputLabel>
          <Select name="itemId" value={formData.itemId} onChange={handleChange} label="Item / Product">
            {items.map(item => <MenuItem key={item.id} value={item.id}>{item.productName} {item.skuCode ? `(${item.skuCode})` : ''}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Quantity Out" name="quantityOut" type="number"
          value={formData.quantityOut} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Price per Unit" name="perPiecePrice" type="number"
          value={formData.perPiecePrice} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Total Cost" name="totalCost" value={formData.totalCost}
          onChange={handleChange} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Invoice Number" name="invoice" value={formData.invoice} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Date of Stock Out" name="dateOfStockOut" type="date"
          value={formData.dateOfStockOut} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required>
          <InputLabel>Payment Status</InputLabel>
          <Select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} label="Payment Status">
            <MenuItem value="paid">Paid</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </Select>
        </FormControl>
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

export default EditStockOut;
