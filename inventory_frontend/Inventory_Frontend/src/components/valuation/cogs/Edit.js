"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { fetchItems } from "@/lib/itemApi";
import { fetchWarehouses } from "@/lib/warehouseApi";

const EditCOGS = ({ editData, handleUpdate, handleClose }) => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, warehousesData] = await Promise.all([
          fetchItems(),
          fetchWarehouses()
        ]);
        setItems(itemsData || []);
        setWarehouses(warehousesData || []);
      } catch (err) {
        console.error("Error loading dependencies", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [formData, setFormData] = useState({
    itemId: "",
    warehouseId: "",
    quantitySold: "",
    startDate: "",
    endDate: "",
    openingStockQty: "",
    openingStockVal: "",
    purchasesQty: "",
    purchasesVal: "",
    closingStockQty: "",
    closingStockVal: ""
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        itemId: editData.itemId?._id || editData.itemId || '',
        warehouseId: editData.warehouse?._id || editData.warehouse || '',
        quantitySold: editData.salesQuantity || editData.quantitySold || '',
        startDate: editData.period?.startDate ? new Date(editData.period.startDate).toISOString().split('T')[0] : '',
        endDate: editData.period?.endDate ? new Date(editData.period.endDate).toISOString().split('T')[0] : '',
        openingStockQty: editData.openingStock?.quantity || '',
        openingStockVal: editData.openingStock?.value || '',
        purchasesQty: editData.purchases?.quantity || '',
        purchasesVal: editData.purchases?.value || '',
        closingStockQty: editData.closingStock?.quantity || '',
        closingStockVal: editData.closingStock?.value || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.itemId) tempErrors.itemId = "Product is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    if (!formData.quantitySold || formData.quantitySold <= 0) tempErrors.quantitySold = "Valid sales quantity is required";
    if (!formData.startDate) tempErrors.startDate = "Start date is required";
    if (!formData.endDate) tempErrors.endDate = "End date is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedItem = items.find(i => i.id === formData.itemId);

    const payload = {
      ...editData,
      itemId: formData.itemId,
      itemName: selectedItem?.productName || "Unknown",
      sku: selectedItem?.skuCode || "N/A",
      warehouse: formData.warehouseId,
      period: {
        startDate: formData.startDate || new Date(),
        endDate: formData.endDate || new Date()
      },
      openingStock: {
        quantity: Number(formData.openingStockQty) || 0,
        value: Number(formData.openingStockVal) || 0
      },
      purchases: {
        quantity: Number(formData.purchasesQty) || 0,
        value: Number(formData.purchasesVal) || 0
      },
      closingStock: {
        quantity: Number(formData.closingStockQty) || 0,
        value: Number(formData.closingStockVal) || 0
      },
      salesQuantity: Number(formData.quantitySold),
      averageCost: selectedItem?.purchasePrice || 0
    };

    handleUpdate(payload);
    handleClose();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <FormControl fullWidth required disabled={loading} error={!!errors.itemId}>
          <InputLabel>Product</InputLabel>
          <Select
            name="itemId"
            value={formData.itemId}
            onChange={handleChange}
          >
            {items.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.productName || item.skuCode}
              </MenuItem>
            ))}
          </Select>
          {errors.itemId && (
            <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
              {errors.itemId}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required disabled={loading} error={!!errors.warehouseId}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
          >
            {warehouses.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.warehouseName || w.name}
              </MenuItem>
            ))}
          </Select>
          {errors.warehouseId && (
            <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
              {errors.warehouseId}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Sales Quantity"
          type="number"
          name="quantitySold"
          value={formData.quantitySold}
          onChange={handleChange}
          required
          error={!!errors.quantitySold}
          helperText={errors.quantitySold}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.startDate}
          helperText={errors.startDate}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="End Date"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.endDate}
          helperText={errors.endDate}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Opening Stock Qty"
          type="number"
          name="openingStockQty"
          value={formData.openingStockQty}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Opening Stock Value"
          type="number"
          name="openingStockVal"
          value={formData.openingStockVal}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Purchases Qty"
          type="number"
          name="purchasesQty"
          value={formData.purchasesQty}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Purchases Value"
          type="number"
          name="purchasesVal"
          value={formData.purchasesVal}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Closing Stock Qty"
          type="number"
          name="closingStockQty"
          value={formData.closingStockQty}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Closing Stock Value"
          type="number"
          name="closingStockVal"
          value={formData.closingStockVal}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={handleClose} 
          variant="outlined"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditCOGS;
