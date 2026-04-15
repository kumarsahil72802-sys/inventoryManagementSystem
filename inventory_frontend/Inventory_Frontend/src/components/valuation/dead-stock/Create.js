"use client";
import React, { useState } from "react";
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

const CreateDeadStock = ({ handleClose, handleCreate }) => {
  const [items, setItems] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, warehousesData] = await Promise.all([
          fetchItems(),
          fetchWarehouses()
        ]);
        setItems(itemsData || []);
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
    lastMovement: "",
    costPrice: "",
    currentValue: "",
    warehouseId: "",
    reason: "",
    notes: ""
  });

  const reasons = ["Obsolete Technology", "Out of Season", "Physical Damage", "Expired", "Low Demand"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.itemId) tempErrors.itemId = "Product is required";
    if (!formData.lastMovement) tempErrors.lastMovement = "Last movement date is required";
    if (!formData.costPrice || formData.costPrice <= 0) tempErrors.costPrice = "Valid cost price is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    if (!formData.reason) tempErrors.reason = "Reason is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const selectedItem = items.find(i => i.id === formData.itemId);
    
    // Calculate days since movement
    const lastDate = new Date(formData.lastMovement);
    const today = new Date();
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const payload = {
      itemId: formData.itemId,
      itemName: selectedItem?.productName || "Unknown",
      sku: selectedItem?.skuCode || "N/A",
      warehouse: formData.warehouseId,
      currentStock: selectedItem?.stock || 0,
      lastMovementDate: formData.lastMovement,
      daysSinceLastMovement: diffDays,
      costPrice: Number(formData.costPrice),
      totalValue: Number(formData.currentValue) || 0,
      status: "Identified",
      notes: formData.reason + (formData.notes ? ": " + formData.notes : ""),
      identifiedBy: "60d0fe4f5311236168a109ca"
    };

    handleCreate(payload);
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
        <TextField
          fullWidth
          label="Last Movement"
          type="date"
          name="lastMovement"
          value={formData.lastMovement}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.lastMovement}
          helperText={errors.lastMovement}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Cost Price"
          type="number"
          name="costPrice"
          value={formData.costPrice}
          onChange={handleChange}
          required
          error={!!errors.costPrice}
          helperText={errors.costPrice}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Current Value"
          type="number"
          name="currentValue"
          value={formData.currentValue}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
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
      <Grid size={12}>
        <FormControl fullWidth required error={!!errors.reason}>
          <InputLabel>Reason</InputLabel>
          <Select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          >
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </Select>
          {errors.reason && (
            <Typography variant="caption" color="error" sx={{ ml: 1.5, mt: 0.5 }}>
              {errors.reason}
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
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateDeadStock;
