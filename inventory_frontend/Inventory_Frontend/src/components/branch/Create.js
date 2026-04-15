"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from "@mui/material";
import { useState } from "react";

const CreateBranch = ({ onClose, onSave, saving }) => {
  const [formData, setFormData] = useState({
    branchName: "",
    branchCode: "",
    branchType: "Branch",
    managerName: "",
    managerEmail: "",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    gstNumber: "",
    panNumber: "",
    establishedDate: "",
    employeeCount: "",
    area: "",
    rentAmount: "",
    status: "Active"
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.branchName.trim()) tempErrors.branchName = "Branch name is required";
    if (!formData.branchCode.trim()) tempErrors.branchCode = "Branch code is required";
    if (!formData.branchType) tempErrors.branchType = "Branch type is required";
    if (!formData.managerName.trim()) tempErrors.managerName = "Manager name is required";
    if (!formData.managerEmail.trim()) tempErrors.managerEmail = "Manager email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.managerEmail)) tempErrors.managerEmail = "Invalid email format";
    if (!formData.phone.trim()) tempErrors.phone = "Phone is required";
    if (!formData.email.trim()) tempErrors.email = "Branch email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!formData.address.trim()) tempErrors.address = "Address is required";
    if (!formData.city.trim()) tempErrors.city = "City is required";
    if (!formData.state) tempErrors.state = "State is required";
    if (!formData.pincode.trim()) tempErrors.pincode = "Pincode is required";
    if (!formData.country.trim()) tempErrors.country = "Country is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const branchTypes = ["Head Office", "Regional Office", "Branch", "Warehouse"];
  
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
    setErrors({ ...errors, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!validate()) return;
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Branch Name"
          name="branchName"
          value={formData.branchName}
          onChange={handleChange}
          required
          placeholder="Enter branch name"
          error={!!errors.branchName}
          helperText={errors.branchName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Branch Code"
          name="branchCode"
          value={formData.branchCode}
          onChange={handleChange}
          required
          placeholder="e.g., BR001"
          error={!!errors.branchCode}
          helperText={errors.branchCode}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth required error={!!errors.branchType}>
          <InputLabel>Branch Type</InputLabel>
          <Select
            name="branchType"
            value={formData.branchType}
            onChange={handleChange}
            label="Branch Type"
          >
            {branchTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.branchType && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.branchType}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Manager Name"
          name="managerName"
          value={formData.managerName}
          onChange={handleChange}
          required
          placeholder="Enter manager name"
          error={!!errors.managerName}
          helperText={errors.managerName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Manager Email"
          name="managerEmail"
          type="email"
          value={formData.managerEmail}
          onChange={handleChange}
          required
          placeholder="manager@example.com"
          error={!!errors.managerEmail}
          helperText={errors.managerEmail}
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
          label="Alternate Phone"
          name="alternatePhone"
          value={formData.alternatePhone}
          onChange={handleChange}
          placeholder="Enter alternate phone (optional)"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Branch Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="branch@example.com"
          error={!!errors.email}
          helperText={errors.email}
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
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Country"
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          error={!!errors.country}
          helperText={errors.country}
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
          label="Established Date"
          name="establishedDate"
          type="date"
          value={formData.establishedDate}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Employee Count"
          name="employeeCount"
          type="number"
          value={formData.employeeCount}
          onChange={handleChange}
          placeholder="0"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Area (sq ft)"
          name="area"
          type="number"
          value={formData.area}
          onChange={handleChange}
          placeholder="0"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Rent Amount"
          name="rentAmount"
          type="number"
          value={formData.rentAmount}
          onChange={handleChange}
          placeholder="0"
        />
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
            <MenuItem value="Under Maintenance">Under Maintenance</MenuItem>
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

export default CreateBranch;