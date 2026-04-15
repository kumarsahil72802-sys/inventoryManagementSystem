"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const CreatePurchase = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierContact: "",
    orderDate: "",
    expectedDeliveryDate: "",
    totalAmount: "",
    paidAmount: "",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    paymentTerms: "30 Days",
    notes: "",
    createdBy: "",
    approvedBy: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.supplierName) tempErrors.supplierName = "Supplier name is required";
    if (!formData.supplierContact) tempErrors.supplierContact = "Supplier contact is required";
    if (!formData.orderDate) tempErrors.orderDate = "Order date is required";
    if (!formData.expectedDeliveryDate) tempErrors.expectedDeliveryDate = "Delivery date is required";
    if (!formData.totalAmount || formData.totalAmount <= 0) tempErrors.totalAmount = "Valid total amount is required";
    if (formData.paidAmount === "" || formData.paidAmount < 0) tempErrors.paidAmount = "Valid paid amount is required";
    if (!formData.paymentStatus) tempErrors.paymentStatus = "Payment status is required";
    if (!formData.orderStatus) tempErrors.orderStatus = "Order status is required";
    if (!formData.paymentTerms) tempErrors.paymentTerms = "Payment terms are required";
    if (!formData.createdBy) tempErrors.createdBy = "Creator name is required";
    if (!formData.approvedBy) tempErrors.approvedBy = "Approver name is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const paymentStatuses = [
    "Paid",
    "Partial",
    "Pending"
  ];

  const orderStatuses = [
    "Pending",
    "Processing",
    "Delivered",
    "Cancelled"
  ];

  const paymentTermsOptions = [
    "15 Days",
    "30 Days",
    "45 Days",
    "60 Days"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (validate() && onSave) {
      onSave(formData);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Supplier Name"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          required
          placeholder="Enter supplier name"
          error={!!errors.supplierName}
          helperText={errors.supplierName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Supplier Contact"
          name="supplierContact"
          value={formData.supplierContact}
          onChange={handleChange}
          required
          placeholder="Enter supplier contact"
          error={!!errors.supplierContact}
          helperText={errors.supplierContact}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Order Date"
          name="orderDate"
          type="date"
          value={formData.orderDate}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          error={!!errors.orderDate}
          helperText={errors.orderDate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Expected Delivery Date"
          name="expectedDeliveryDate"
          type="date"
          value={formData.expectedDeliveryDate}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          error={!!errors.expectedDeliveryDate}
          helperText={errors.expectedDeliveryDate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Total Amount"
          name="totalAmount"
          type="number"
          value={formData.totalAmount}
          onChange={handleChange}
          required
          placeholder="Enter total amount"
          error={!!errors.totalAmount}
          helperText={errors.totalAmount}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Paid Amount"
          name="paidAmount"
          type="number"
          value={formData.paidAmount}
          onChange={handleChange}
          required
          placeholder="Enter paid amount"
          error={!!errors.paidAmount}
          helperText={errors.paidAmount}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.paymentStatus}>
          <InputLabel>Payment Status</InputLabel>
          <Select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            label="Payment Status"
          >
            {paymentStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          {errors.paymentStatus && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.paymentStatus}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.orderStatus}>
          <InputLabel>Order Status</InputLabel>
          <Select
            name="orderStatus"
            value={formData.orderStatus}
            onChange={handleChange}
            label="Order Status"
          >
            {orderStatuses.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
          {errors.orderStatus && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.orderStatus}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.paymentTerms}>
          <InputLabel>Payment Terms</InputLabel>
          <Select
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            label="Payment Terms"
          >
            {paymentTermsOptions.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
          {errors.paymentTerms && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.paymentTerms}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Created By"
          name="createdBy"
          value={formData.createdBy}
          onChange={handleChange}
          required
          placeholder="Enter created by"
          error={!!errors.createdBy}
          helperText={errors.createdBy}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Approved By"
          name="approvedBy"
          value={formData.approvedBy}
          onChange={handleChange}
          required
          placeholder="Enter approved by"
          error={!!errors.approvedBy}
          helperText={errors.approvedBy}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
          placeholder="Enter notes"
        />
      </Grid>
      <Grid size={{ xs: 12 }} display="flex" justifyContent="flex-end" gap={2}>
        <Button 
          onClick={onClose} 
          variant="outlined" 
          sx={{ transform: 'none', textTransform: 'none' }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            transform: 'none', 
            textTransform: 'none' 
          }}
        >
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreatePurchase;
