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
  CircularProgress,
} from "@mui/material";
import { fetchItems } from '../../../lib/itemApi';
import { fetchWarehouses } from '../../../lib/warehouseApi';
import { fetchStaffList } from '../../../lib/staffApi';
import { fetchDamageRecords } from '../../../lib/damageApi';

const CreateReceipt = ({ handleClose, handleCreate }) => {
  const [formData, setFormData] = useState({
    receiptNumber: "",
    damageId: "",
    itemId: "",
    productName: "",
    warehouseId: "",
    warehouseName: "",
    receiptDate: "",
    damagedQuantity: "",
    unitCost: "",
    totalValue: "",
    damageDescription: "",
    status: "Draft",
    createdBy: "",
    notes: ""
  });

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [damageRecords, setDamageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsRes, warehousesRes, staffRes, damageRes] = await Promise.all([
          fetchItems(1, 100),
          fetchWarehouses(),
          fetchStaffList(),
          fetchDamageRecords(1, 100)
        ]);
        setProducts(productsRes.data || []);
        setWarehouses(warehousesRes.data || warehousesRes || []);
        setStaff(staffRes.data || []);
        setDamageRecords(damageRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(p => (p.productName || p.name) === e.target.value);
    setFormData({
      ...formData,
      productName: e.target.value,
      itemId: selectedProduct?.id || selectedProduct?._id || '',
      unitCost: selectedProduct?.purchasePrice || selectedProduct?.unitCost || ''
    });
  };

  const handleWarehouseChange = (e) => {
    const selectedWarehouse = warehouses.find(w => (w.warehouseName || w.name) === e.target.value);
    setFormData({
      ...formData,
      warehouseName: e.target.value,
      warehouseId: selectedWarehouse?.id || selectedWarehouse?._id || selectedWarehouse?.warehouseId || ''
    });
  };

  const handleStaffChange = (e) => {
    const selectedStaff = staff.find(s => (s.staffName || s.name) === e.target.value);
    setFormData({
      ...formData,
      createdBy: selectedStaff?.id || selectedStaff?._id || selectedStaff?.staffId || ''
    });
  };

  const handleDamageChange = (e) => {
    const selectedDamage = damageRecords.find(d => d.damageId === e.target.value);
    setFormData({
      ...formData,
      damageId: selectedDamage?.id || selectedDamage?._id || ''
    });
  };

  const calculateTotalValue = () => {
    const qty = Number(formData.damagedQuantity) || 0;
    const cost = Number(formData.unitCost) || 0;
    return qty * cost;
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.receiptNumber) tempErrors.receiptNumber = "Receipt number is required";
    if (!formData.damageId) tempErrors.damageId = "Related damage record is required";
    if (!formData.itemId) tempErrors.itemId = "Product is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    if (!formData.receiptDate) tempErrors.receiptDate = "Receipt date is required";
    if (!formData.damagedQuantity || formData.damagedQuantity <= 0) tempErrors.damagedQuantity = "Valid quantity is required";
    if (!formData.unitCost || formData.unitCost < 0) tempErrors.unitCost = "Unit cost is required";
    if (!formData.damageDescription) tempErrors.damageDescription = "Description is required";
    if (!formData.createdBy) tempErrors.createdBy = "Created by is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const submitData = {
      ...formData,
      totalValue: calculateTotalValue()
    };

    handleCreate(submitData);
    handleClose();
  };

  if (loading) {
    return (
      <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ minHeight: 200 }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Receipt Number"
          name="receiptNumber"
          value={formData.receiptNumber}
          onChange={handleChange}
          required
          error={!!errors.receiptNumber}
          helperText={errors.receiptNumber}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.damageId}>
          <InputLabel>Related Damage Record</InputLabel>
          <Select
            name="damageId"
            value={formData.damageId ? damageRecords.find(d => (d.id || d._id) === formData.damageId)?.damageId || '' : ''}
            onChange={handleDamageChange}
          >
            {damageRecords.map((damage) => (
              <MenuItem key={damage.id || damage._id} value={damage.damageId}>
                {damage.damageId} - {damage.productName}
              </MenuItem>
            ))}
          </Select>
          {errors.damageId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.damageId}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.itemId}>
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
          {errors.itemId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.itemId}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.warehouseId}>
          <InputLabel>Warehouse</InputLabel>
          <Select
            name="warehouseName"
            value={formData.warehouseName}
            onChange={handleWarehouseChange}
          >
            {warehouses.map((warehouse) => (
              <MenuItem key={warehouse.id || warehouse._id || warehouse.warehouseId} value={warehouse.warehouseName || warehouse.name}>
                {warehouse.warehouseName || warehouse.name}
              </MenuItem>
            ))}
          </Select>
          {errors.warehouseId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.warehouseId}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Receipt Date"
          type="date"
          name="receiptDate"
          value={formData.receiptDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.receiptDate}
          helperText={errors.receiptDate}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.createdBy}>
          <InputLabel>Created By</InputLabel>
          <Select
            name="createdBy"
            value={staff.find(s => (s.id || s._id || s.staffId) === formData.createdBy)?.staffName || staff.find(s => (s.id || s._id || s.staffId) === formData.createdBy)?.name || ''}
            onChange={handleStaffChange}
          >
            {staff.map((person) => (
              <MenuItem key={person.id || person._id || person.staffId} value={person.staffName || person.name}>
                {person.staffName || person.name}
              </MenuItem>
            ))}
          </Select>
          {errors.createdBy && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.createdBy}</Typography>}
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
        <TextField
          fullWidth
          label="Total Value"
          type="number"
          name="totalValue"
          value={calculateTotalValue()}
          InputProps={{ readOnly: true }}
          disabled
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="Draft">Draft</MenuItem>
            <MenuItem value="Submitted">Submitted</MenuItem>
            <MenuItem value="Under Review">Under Review</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Damage Description"
          name="damageDescription"
          value={formData.damageDescription}
          onChange={handleChange}
          multiline
          rows={3}
          required
          error={!!errors.damageDescription}
          helperText={errors.damageDescription}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={2}
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

export default CreateReceipt;
