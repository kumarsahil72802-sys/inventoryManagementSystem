"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const EditSupplier = ({ supplierData, onClose, onSave, saving }) => {
  const paymentTermsOptions = ["Net 15", "Net 30", "Net 45", "Net 60", "Cash"];

  const [formData, setFormData] = useState({
    supplierName: "",
    contactPerson: "",
    companyName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    panNumber: "",
    supplierType: "",
    creditLimit: "",
    paymentTerms: "Net 30",
    status: "Active",
    rating: 3,
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    bankBranch: "",
    bankLocation: ""
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.supplierName) tempErrors.supplierName = "Supplier name is required";
    if (!formData.companyName) tempErrors.companyName = "Company name is required";
    if (!formData.address) tempErrors.address = "Address is required";
    if (!formData.email) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
    
    if (!formData.phone) tempErrors.phone = "Phone number is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.state) tempErrors.state = "State is required";
    if (!formData.pincode) tempErrors.pincode = "Pincode is required";
    if (!formData.gstNumber) tempErrors.gstNumber = "GST number is required";
    if (!formData.panNumber) tempErrors.panNumber = "PAN number is required";
    if (!formData.supplierType) tempErrors.supplierType = "Supplier type is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const supplierTypes = [
    "Electronics",
    "Furniture",
    "Kitchenware",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Automotive",
    "Health & Beauty"
  ];

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Chandigarh"
  ];

  useEffect(() => {
    if (supplierData) {
      setFormData({
        supplierName: supplierData.supplierName || "",
        contactPerson: supplierData.contactPerson || "",
        companyName: supplierData.companyName || "",
        email: supplierData.email || "",
        phone: supplierData.phone || "",
        address: supplierData.address || "",
        city: supplierData.city || "",
        state: supplierData.state || "",
        pincode: supplierData.pincode || "",
        gstNumber: supplierData.gstNumber || "",
        panNumber: supplierData.panNumber || "",
        supplierType: supplierData.supplierType || "",
        creditLimit: supplierData.creditLimit ?? "",
        paymentTerms: supplierData.paymentTerms || "Net 30",
        status: supplierData.status || "Active",
        rating: supplierData.rating ?? 3,
        accountHolderName: supplierData.accountHolderName || "",
        accountNumber: supplierData.accountNumber || "",
        bankName: supplierData.bankName || "",
        ifscCode: supplierData.ifscCode || supplierData.IFSC || "",
        bankBranch: supplierData.bankBranch || "",
        bankLocation: supplierData.bankLocation || ""
      });
    }
  }, [supplierData]);

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
          label="Contact Person"
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Enter contact person name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Company Name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          required
          placeholder="Enter company name"
          error={!!errors.companyName}
          helperText={errors.companyName}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          placeholder="Enter address"
          error={!!errors.address}
          helperText={errors.address}
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
            value={formData.state}
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
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="GST Number"
          name="gstNumber"
          value={formData.gstNumber}
          onChange={handleChange}
          required
          placeholder="Enter GST number"
          error={!!errors.gstNumber}
          helperText={errors.gstNumber}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="PAN Number"
          name="panNumber"
          value={formData.panNumber}
          onChange={handleChange}
          required
          placeholder="Enter PAN number"
          error={!!errors.panNumber}
          helperText={errors.panNumber}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.supplierType}>
          <InputLabel>Supplier Type</InputLabel>
          <Select
            name="supplierType"
            value={formData.supplierType}
            onChange={handleChange}
            label="Supplier Type"
          >
            {supplierTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.supplierType && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.supplierType}</Typography>}
        </FormControl>
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
        <FormControl fullWidth required>
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
      <Grid size={{ xs: 12 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1976d2', mb: 1, mt: 1 }}>
          Account Details
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Account Holder Name"
          name="accountHolderName"
          value={formData.accountHolderName}
          onChange={handleChange}
          placeholder="Enter account holder name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={handleChange}
          placeholder="Enter account number"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Bank Name"
          name="bankName"
          value={formData.bankName}
          onChange={handleChange}
          placeholder="Enter bank name"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="IFSC Code"
          name="ifscCode"
          value={formData.ifscCode}
          onChange={handleChange}
          placeholder="Enter IFSC code"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Bank Branch"
          name="bankBranch"
          value={formData.bankBranch}
          onChange={handleChange}
          placeholder="Enter bank branch"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Bank Location"
          name="bankLocation"
          value={formData.bankLocation}
          onChange={handleChange}
          placeholder="Enter bank location"
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
          disabled={saving}
          sx={{ 
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
            transform: 'none', 
            textTransform: 'none' 
          }}
        >
          {saving ? "Updating..." : "Update"}
        </Button>
      </Grid>
    </Grid>
  );
};

export default EditSupplier;