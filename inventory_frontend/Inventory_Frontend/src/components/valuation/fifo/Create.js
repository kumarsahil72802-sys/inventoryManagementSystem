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

const CreateFIFO = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    itemId: "",
    method: "",
    openingStock: "",
    purchases: "",
    sales: "",
    unitCost: "",
    warehouseId: "",
  });
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

  const methods = ["FIFO", "LIFO", "Weighted Average"];

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
    if (!formData.purchases || formData.purchases < 0) tempErrors.purchases = "Valid purchases is required";
    if (!formData.sales || formData.sales < 0) tempErrors.sales = "Valid sales is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    // Map to valid backend schema names
    const payload = {
      itemId: formData.itemId,
      warehouseId: formData.warehouseId,
      valuationMethod: formData.method,
      openingStock: Number(formData.openingStock),
      totalValue: Number(formData.unitCost) * Number(formData.openingStock),
      averageCost: Number(formData.unitCost),
      // Set to random period, typical for form defaults if period input isn't present
      period: {
        startDate: new Date(),
        endDate: new Date()
      },
      totalStock: Number(formData.openingStock) + Number(formData.purchases) - Number(formData.sales),
      createdBy: "60d0fe4f5311236168a109ca" // Fallback ObjectId for staff, needed for backend constraints if not logged in
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
            value={formData.itemId || ""}
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
          error={!!errors.purchases}
          helperText={errors.purchases}
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
          error={!!errors.sales}
          helperText={errors.sales}
        />
      </Grid>
      <Grid size={12}>
        <FormControl fullWidth required disabled={loading} error={!!errors.warehouseId}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouseId"
            value={formData.warehouseId || ""}
            onChange={handleChange}
          >
            {warehousesList.map((warehouse) => (
              <MenuItem key={warehouse.id} value={warehouse.id}>
                {warehouse.warehouseName || warehouse.name}
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
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateFIFO;
