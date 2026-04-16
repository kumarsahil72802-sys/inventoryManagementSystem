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
  Typography,
} from "@mui/material";
import { fetchItems } from '../../lib/itemApi';
import { fetchStaffList } from '../../lib/staffApi';
import { fetchWarehouses } from '../../lib/warehouseApi';

const CreateDamage = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    productName: "",
    itemId: "",
    damageDate: "",
    damageType: "",
    damagedQuantity: "",
    unitCost: "",
    reportedBy: "",
    reportedById: "",
    warehouse: "",
    warehouseId: "",
    notes: ""
  });

  const [products, setProducts] = useState([]);
  const [staff, setStaff] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const damageTypes = ["Physical Damage", "Water Damage", "Breakage", "Fire Damage", "Theft", "Expired"];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsRes, staffRes, warehousesRes] = await Promise.all([
          fetchItems(1, 100),
          fetchStaffList(),
          fetchWarehouses()
        ]);
        setProducts(productsRes.data || []);
        setStaff(staffRes.data || []);
        setWarehouses(warehousesRes.data || warehousesRes || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(p => (p.productName || p.name) === e.target.value);
    setFormData({
      ...formData,
      productName: e.target.value,
      itemId: selectedProduct?.id || selectedProduct?._id || ''
    });
  };

  const handleStaffChange = (e) => {
    const selectedStaff = staff.find(s => (s.staffName || s.name) === e.target.value);
    setFormData({
      ...formData,
      reportedBy: e.target.value,
      reportedById: selectedStaff?.id || selectedStaff?._id || selectedStaff?.staffId || ''
    });
  };

  const handleWarehouseChange = (e) => {
    const selectedWarehouse = warehouses.find(w => (w.warehouseName || w.name || w) === e.target.value);
    setFormData({
      ...formData,
      warehouse: e.target.value,
      warehouseId: selectedWarehouse?.id || selectedWarehouse?._id || selectedWarehouse?.warehouseId || ''
    });
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.productName) tempErrors.productName = "Product is required";
    if (!formData.damageDate) tempErrors.damageDate = "Damage date is required";
    if (!formData.damageType) tempErrors.damageType = "Damage type is required";
    if (!formData.damagedQuantity || formData.damagedQuantity <= 0) tempErrors.damagedQuantity = "Valid quantity is required";
    if (!formData.unitCost || formData.unitCost < 0) tempErrors.unitCost = "Unit cost is required";
    if (!formData.reportedBy) tempErrors.reportedBy = "Reported by is required";
    if (!formData.warehouse) tempErrors.warehouse = "Warehouse is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    handleCreate(formData);
    handleClose();
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.productName}>
          <InputLabel>Product Name</InputLabel>
          <Select
            name="productName"
            value={formData.productName}
            onChange={handleProductChange}
          >
            {products.map((product) => (
              <MenuItem key={product.id || product._id} value={product.productName || product.name}>
                {product.productName || product.name}
              </MenuItem>
            ))}
          </Select>
          {errors.productName && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.productName}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Damage Date"
          type="date"
          name="damageDate"
          value={formData.damageDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.damageDate}
          helperText={errors.damageDate}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.damageType}>
          <InputLabel>Damage Type</InputLabel>
          <Select
            name="damageType"
            value={formData.damageType}
            onChange={handleChange}
          >
            {damageTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.damageType && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.damageType}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Damaged Quantity"
          type="number"
          name="damagedQuantity"
          value={formData.damagedQuantity}
          onChange={handleChange}
          required
          error={!!errors.damagedQuantity}
          helperText={errors.damagedQuantity}
        />
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
        <FormControl fullWidth required error={!!errors.reportedBy}>
          <InputLabel>Reported By</InputLabel>
          <Select
            name="reportedBy"
            value={formData.reportedBy}
            onChange={handleStaffChange}
          >
            {staff.map((person) => (
              <MenuItem key={person.id || person._id || person.staffId} value={person.staffName || person.name}>
                {person.staffName || person.name}
              </MenuItem>
            ))}
          </Select>
          {errors.reportedBy && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.reportedBy}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={12}>
        <FormControl fullWidth required error={!!errors.warehouse}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouse"
            value={formData.warehouse}
            onChange={handleWarehouseChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id || warehouse._id || warehouse.warehouseId} value={warehouse.warehouseName || warehouse.name || warehouse}>
                {warehouse.warehouseName || warehouse.name || warehouse}
              </MenuItem>
            ))}
          </Select>
          {errors.warehouse && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.warehouse}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
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
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateDamage;