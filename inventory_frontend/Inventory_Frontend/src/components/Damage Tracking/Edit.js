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

const EditDamage = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    productName: "",
    damageDate: "",
    damageType: "",
    damagedQuantity: "",
    unitCost: "",
    reportedBy: "",
    warehouse: "",
    status: "",
    notes: ""
  });

  const products = ["Samsung Galaxy S24", "Office Chair", "Coffee Mug", "LED TV", "Wireless Mouse", "Keyboard"];
  const damageTypes = ["Physical Damage", "Water Damage", "Breakage", "Fire Damage", "Theft", "Expired"];
  const warehouses = ["Main Warehouse", "Electronics Warehouse", "Furniture Warehouse", "North Warehouse", "South Warehouse"];
  const staff = ["Rajesh Kumar", "Amit Patel", "Meera Joshi", "Priya Singh", "Sunita Patel"];
  const statuses = ["Pending", "Approved", "Rejected"];

  useEffect(() => {
    if (editData) {
      setFormData({
        productName: editData.productName || '',
        damageDate: editData.damageDate || '',
        damageType: editData.damageType || '',
        damagedQuantity: editData.damagedQuantity || '',
        unitCost: editData.unitCost || '',
        reportedBy: editData.reportedBy || '',
        warehouse: editData.warehouse || '',
        status: editData.status || '',
        notes: editData.notes || ''
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
    if (!formData.productName) tempErrors.productName = "Product is required";
    if (!formData.damageDate) tempErrors.damageDate = "Damage date is required";
    if (!formData.damageType) tempErrors.damageType = "Damage type is required";
    if (!formData.damagedQuantity || formData.damagedQuantity <= 0) tempErrors.damagedQuantity = "Valid quantity is required";
    if (!formData.unitCost || formData.unitCost < 0) tempErrors.unitCost = "Unit cost is required";
    if (!formData.reportedBy) tempErrors.reportedBy = "Reported by is required";
    if (!formData.warehouse) tempErrors.warehouse = "Warehouse is required";
    if (!formData.status) tempErrors.status = "Status is required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    handleUpdate({ ...editData, ...formData });
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
            onChange={handleChange}
          >
            {products.map((product) => (
              <MenuItem key={product} value={product}>
                {product}
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
            onChange={handleChange}
          >
            {staff.map((person) => (
              <MenuItem key={person} value={person}>
                {person}
              </MenuItem>
            ))}
          </Select>
          {errors.reportedBy && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.reportedBy}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.warehouse}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouse"
            value={formData.warehouse}
            onChange={handleChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse} value={warehouse}>
                {warehouse}
              </MenuItem>
            ))}
          </Select>
          {errors.warehouse && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.warehouse}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.status}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          {errors.status && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.status}</Typography>}
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
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditDamage;