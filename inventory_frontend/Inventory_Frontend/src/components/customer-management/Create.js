"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const CreateCustomer = ({ onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    creditLimit: "",
    paymentTerms: "Net 30",
    customerType: "Retail",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.customerName) tempErrors.customerName = "Customer name is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
    
    if (!formData.phone) tempErrors.phone = "Phone number is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.state) tempErrors.state = "State is required";
    if (!formData.pincode) tempErrors.pincode = "Pincode is required";
    if (!formData.address) tempErrors.address = "Address is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const customerTypes = ["Retail", "Wholesale", "Corporate", "Individual"];
  const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "Cash"];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
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
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter email address"
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="Enter phone number"
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Enter company name (optional)"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          placeholder="Enter city"
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.state}>
          <InputLabel>State</InputLabel>
          <Select
            name="state"
            value={formData.state ?? ""}
            onChange={handleChange}
            label="State"
          >
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
          {errors.state && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.state}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Pincode"
          name="pincode"
          value={formData.pincode}
          onChange={handleChange}
          required
          placeholder="Enter pincode"
          error={!!errors.pincode}
          helperText={errors.pincode}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          multiline
          rows={2}
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Enter complete address"
          error={!!errors.address}
          helperText={errors.address}
        />
      </Grid>
     
    
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="GST Number"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          placeholder="Enter GST number (optional)"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          placeholder="Enter PAN number (optional)"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Credit Limit"
          name="creditLimit"
          type="number"
          value={formData.creditLimit}
          onChange={handleChange}
          placeholder="0"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
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
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Customer Type</InputLabel>
          <Select
            name="customerType"
            value={formData.customerType}
            onChange={handleChange}
            label="Customer Type"
          >
            {customerTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            label="Status"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
            <MenuItem value="Blocked">Blocked</MenuItem>
          </Select>
        </FormControl>
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
          disabled={saving}
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            transform: 'none', 
            textTransform: 'none' 
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateCustomer;