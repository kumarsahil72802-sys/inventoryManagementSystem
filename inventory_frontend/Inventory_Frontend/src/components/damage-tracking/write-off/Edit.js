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

const EditWriteOff = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    id: "",
    writeOffNumber: "",
    damageId: "",
    itemId: "",
    productName: "",
    warehouseId: "",
    warehouseName: "",
    writeOffDate: "",
    quantity: "",
    unitCost: "",
    totalValue: "",
    writeOffReason: "",
    reasonDescription: "",
    disposalMethod: "",
    disposalDetails: "",
    financialImpact: "",
    recoveryAmount: "",
    status: "Pending",
    createdBy: "",
    notes: ""
  });

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [staff, setStaff] = useState([]);
  const [damageRecords, setDamageRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  const writeOffReasons = ['Damaged', 'Expired', 'Obsolete', 'Theft', 'Lost', 'Quality Issue', 'Other'];
  const disposalMethods = ['Destroyed', 'Donated', 'Recycled', 'Returned to Supplier', 'Sold as Scrap', 'Other'];
  const financialImpacts = ['Write-off', 'Insurance Claim', 'Supplier Credit', 'Partial Recovery'];

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

  useEffect(() => {
    if (editData) {
      setFormData({
        id: editData.id || editData._id || '',
        writeOffNumber: editData.writeOffNumber || '',
        damageId: editData.damageId?.id || editData.damageId || '',
        itemId: editData.itemId || '',
        productName: editData.productName || '',
        warehouseId: editData.warehouseId || '',
        warehouseName: editData.warehouseName || '',
        writeOffDate: editData.writeOffDate || '',
        quantity: editData.quantity || '',
        unitCost: editData.unitCost || '',
        totalValue: editData.totalValue || '',
        writeOffReason: editData.writeOffReason || '',
        reasonDescription: editData.reasonDescription || '',
        disposalMethod: editData.disposalMethod || '',
        disposalDetails: editData.disposalDetails || '',
        financialImpact: editData.financialImpact || '',
        recoveryAmount: editData.recoveryAmount || '',
        status: editData.status || 'Pending',
        createdBy: editData.createdById || editData.createdBy || '',
        notes: editData.notes || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find(p => (p.productName || p.name) === e.target.value);
    setFormData({
      ...formData,
      productName: e.target.value,
      itemId: selectedProduct?.id || selectedProduct?._id || ''
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

  const handleDamageChange = (e) => {
    const selectedDamage = damageRecords.find(d => d.damageId === e.target.value);
    setFormData({
      ...formData,
      damageId: selectedDamage?.id || selectedDamage?._id || ''
    });
  };

  const calculateTotalValue = () => {
    const qty = Number(formData.quantity) || 0;
    const cost = Number(formData.unitCost) || 0;
    return qty * cost;
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.writeOffNumber) tempErrors.writeOffNumber = "Write-off number is required";
    if (!formData.damageId) tempErrors.damageId = "Related damage record is required";
    if (!formData.itemId) tempErrors.itemId = "Product is required";
    if (!formData.warehouseId) tempErrors.warehouseId = "Warehouse is required";
    if (!formData.writeOffDate) tempErrors.writeOffDate = "Write-off date is required";
    if (!formData.quantity || formData.quantity <= 0) tempErrors.quantity = "Valid quantity is required";
    if (!formData.unitCost || formData.unitCost < 0) tempErrors.unitCost = "Unit cost is required";
    if (!formData.writeOffReason) tempErrors.writeOffReason = "Write-off reason is required";
    if (!formData.reasonDescription) tempErrors.reasonDescription = "Reason description is required";
    if (!formData.disposalMethod) tempErrors.disposalMethod = "Disposal method is required";
    if (!formData.financialImpact) tempErrors.financialImpact = "Financial impact is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const submitData = {
      ...formData,
      totalValue: calculateTotalValue()
    };

    handleUpdate(submitData);
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
          label="Write-off Number"
          name="writeOffNumber"
          value={formData.writeOffNumber}
          onChange={handleChange}
          required
          error={!!errors.writeOffNumber}
          helperText={errors.writeOffNumber}
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
          label="Write-off Date"
          type="date"
          name="writeOffDate"
          value={formData.writeOffDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
          error={!!errors.writeOffDate}
          helperText={errors.writeOffDate}
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
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          error={!!errors.quantity}
          helperText={errors.quantity}
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
        <TextField
          fullWidth
          label="Recovery Amount"
          type="number"
          name="recoveryAmount"
          value={formData.recoveryAmount}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.writeOffReason}>
          <InputLabel>Write-off Reason</InputLabel>
          <Select
            name="writeOffReason"
            value={formData.writeOffReason}
            onChange={handleChange}
          >
            {writeOffReasons.map((reason) => (
              <MenuItem key={reason} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
          {errors.writeOffReason && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.writeOffReason}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.disposalMethod}>
          <InputLabel>Disposal Method</InputLabel>
          <Select
            name="disposalMethod"
            value={formData.disposalMethod}
            onChange={handleChange}
          >
            {disposalMethods.map((method) => (
              <MenuItem key={method} value={method}>{method}</MenuItem>
            ))}
          </Select>
          {errors.disposalMethod && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.disposalMethod}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required error={!!errors.financialImpact}>
          <InputLabel>Financial Impact</InputLabel>
          <Select
            name="financialImpact"
            value={formData.financialImpact}
            onChange={handleChange}
          >
            {financialImpacts.map((impact) => (
              <MenuItem key={impact} value={impact}>{impact}</MenuItem>
            ))}
          </Select>
          {errors.financialImpact && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.financialImpact}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Reason Description"
          name="reasonDescription"
          value={formData.reasonDescription}
          onChange={handleChange}
          multiline
          rows={2}
          required
          error={!!errors.reasonDescription}
          helperText={errors.reasonDescription}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Disposal Details"
          name="disposalDetails"
          value={formData.disposalDetails}
          onChange={handleChange}
          multiline
          rows={2}
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
          Update
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditWriteOff;
