"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const CreateSales = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    orderDate: "",
    deliveryDate: "",
    totalAmount: "",
    paidAmount: "",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    paymentMethod: "Cash",
    notes: "",
    salesPerson: "",
    deliveryAddress: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.customerName) tempErrors.customerName = "Customer name is required";
    if (!formData.customerEmail) tempErrors.customerEmail = "Customer email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) tempErrors.customerEmail = "Invalid email format";
    
    if (!formData.customerPhone) tempErrors.customerPhone = "Customer phone is required";
    if (!formData.orderDate) tempErrors.orderDate = "Order date is required";
    if (!formData.deliveryDate) tempErrors.deliveryDate = "Delivery date is required";
    
    if (!formData.totalAmount || formData.totalAmount <= 0) tempErrors.totalAmount = "Valid total amount is required";
    if (formData.paidAmount === "" || formData.paidAmount < 0) tempErrors.paidAmount = "Valid paid amount is required";
    
    if (!formData.paymentStatus) tempErrors.paymentStatus = "Payment status is required";
    if (!formData.orderStatus) tempErrors.orderStatus = "Order status is required";
    if (!formData.paymentMethod) tempErrors.paymentMethod = "Payment method is required";
    if (!formData.salesPerson) tempErrors.salesPerson = "Sales person is required";
    if (!formData.deliveryAddress) tempErrors.deliveryAddress = "Delivery address is required";

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

  const paymentMethods = [
    "Cash",
    "UPI",
    "Credit",
    "Bank Transfer",
    "Cash on Delivery"
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
          label="Customer Name"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          required
          placeholder="Enter customer name"
          error={!!errors.customerName}
          helperText={errors.customerName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Customer Email"
          name="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={handleChange}
          required
          placeholder="Enter customer email"
          error={!!errors.customerEmail}
          helperText={errors.customerEmail}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Customer Phone"
          name="customerPhone"
          value={formData.customerPhone}
          onChange={handleChange}
          required
          placeholder="Enter customer phone"
          error={!!errors.customerPhone}
          helperText={errors.customerPhone}
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
          label="Delivery Date"
          name="deliveryDate"
          type="date"
          value={formData.deliveryDate}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          error={!!errors.deliveryDate}
          helperText={errors.deliveryDate}
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
        <FormControl fullWidth required error={!!errors.paymentMethod}>
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            label="Payment Method"
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
          {errors.paymentMethod && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.paymentMethod}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Sales Person"
          name="salesPerson"
          value={formData.salesPerson}
          onChange={handleChange}
          required
          placeholder="Enter sales person"
          error={!!errors.salesPerson}
          helperText={errors.salesPerson}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          label="Delivery Address"
          name="deliveryAddress"
          value={formData.deliveryAddress}
          onChange={handleChange}
          required
          placeholder="Enter delivery address"
          error={!!errors.deliveryAddress}
          helperText={errors.deliveryAddress}
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

export default CreateSales;
