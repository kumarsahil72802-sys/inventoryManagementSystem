"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";

const EditStockIn = ({ stockData, onClose, onSave, items = [], suppliers = [], loading = false }) => {
  const [formData, setFormData] = useState({
    itemId: "", quantityIn: "", purchasePrice: "", totalCost: "",
    supplierId: "", invoice: "", dateOfStockIn: "", paymentStatus: "pending"
  });

  useEffect(() => {
    if (stockData) {
      setFormData({
        itemId: stockData.itemId || "",
        quantityIn: stockData.quantityIn || stockData.quantity || "",
        purchasePrice: stockData.perPiecePrice || "",
        totalCost: stockData.totalCost || "",
        supplierId: stockData.supplierId || "",
        invoice: stockData.invoice !== '—' ? (stockData.invoice || "") : "",
        dateOfStockIn: stockData.dateOfStockIn || stockData.entryDate || "",
        paymentStatus: (stockData.paymentStatus || "pending").toLowerCase(),
      });
    }
  }, [stockData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "quantityIn" || name === "purchasePrice") {
      const qty = name === "quantityIn" ? value : formData.quantityIn;
      const price = name === "purchasePrice" ? value : formData.purchasePrice;
      if (qty && price) updated.totalCost = (parseFloat(qty) * parseFloat(price)).toFixed(2);
    }
    setFormData(updated);
  };

  const handleSave = () => {
    if (!formData.itemId || !formData.quantityIn) { alert("Please fill required fields."); return; }
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
        <TextField fullWidth label="Quantity In" name="quantityIn" type="number"
          value={formData.quantityIn} onChange={handleChange} required />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Purchase Price (per unit)" name="purchasePrice" type="number"
          value={formData.purchasePrice} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Total Cost" name="totalCost" value={formData.totalCost}
          onChange={handleChange} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Supplier</InputLabel>
          <Select name="supplierId" value={formData.supplierId} onChange={handleChange} label="Supplier">
            <MenuItem value=""><em>None</em></MenuItem>
            {suppliers.map(sup => <MenuItem key={sup.id} value={sup.id}>{sup.supplierName}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Invoice Number" name="invoice" value={formData.invoice} onChange={handleChange} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Date of Stock In" name="dateOfStockIn" type="date"
          value={formData.dateOfStockIn} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
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

export default EditStockIn;
