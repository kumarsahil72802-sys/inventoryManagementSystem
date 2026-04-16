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

const EditFIFO = ({ editData, handleUpdate, handleClose }) => {
  const [items, setItems] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, warehousesData] = await Promise.all([
          fetchItems(),
          fetchWarehouses()
        ]);
        setItems(itemsData?.data || []);
        setWarehousesList(warehousesData || []);
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
    method: "",
    openingStock: "",
    purchases: "",
    sales: "",
    unitCost: "",
    warehouseId: ""
  });

  const methods = ["FIFO", "LIFO", "Weighted Average"];

  useEffect(() => {
    if (editData) {
      setFormData({
        itemId: editData.itemId?._id || editData.itemId || '',
        method: editData.valuationMethod || editData.method || '',
        openingStock: editData.openingStock || '',
        purchases: editData.purchases || 0,
        sales: editData.sales || 0,
        unitCost: editData.averageCost || editData.unitCost || '',
        warehouseId: editData.warehouseId?._id || editData.warehouseId || editData.warehouse || ''
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
    if (!formData.method) tempErrors.method = "Valuation method is required";
    if (!formData.unitCost || formData.unitCost <= 0) tempErrors.unitCost = "Valid unit cost is required";
    if (!formData.openingStock || formData.openingStock < 0) tempErrors.openingStock = "Valid opening stock is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const payload = {
      ...editData,
      itemId: formData.itemId,
      valuationMethod: formData.method,
      openingStock: Number(formData.openingStock),
      averageCost: Number(formData.unitCost),
      warehouseId: formData.warehouseId,
      totalStock: Number(formData.openingStock) + (Number(formData.purchases) || 0) - (Number(formData.sales) || 0),
      totalValue: Number(formData.unitCost) * (Number(formData.openingStock) + (Number(formData.purchases) || 0) - (Number(formData.sales) || 0))
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
        <FormControl fullWidth required error={!!errors.method}>
          <InputLabel>Method</InputLabel>
          <Select
            name="method"
            value={formData.method}
            onChange={handleChange}
          >
            {methods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          {errors.method && (
            <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
              {errors.method}
            </Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Unit Cost"
          type="number"
          name="unitCost"
          value={formData.unitCost}
          onChange={handleChange}
          required
          error={!!errors.unitCost}
          helperText={errors.unitCost}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Opening Stock"
          type="number"
          name="openingStock"
          value={formData.openingStock}
          onChange={handleChange}
          required
          error={!!errors.openingStock}
          helperText={errors.openingStock}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Purchases"
          type="number"
          name="purchases"
          value={formData.purchases}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Sales"
          type="number"
          name="sales"
          value={formData.sales}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={12}>
        <FormControl fullWidth required disabled={loading} error={!!errors.warehouseId}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouseId"
            value={formData.warehouseId}
            onChange={handleChange}
          >
            {warehousesList.map((w) => (
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

export default EditFIFO;
