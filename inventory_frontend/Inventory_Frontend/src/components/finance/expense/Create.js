import React from "react";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box
} from "@mui/material";

const Create = ({ formData, handleInputChange, handleCreate, handleClose, errors = {} }) => {
  return (
    <Grid container spacing={2}>
      <Grid size={{xs:12, sm:6}}>
        <TextField
          label="Expense Name"
          fullWidth
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
        />
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth error={!!errors.type}>
          <InputLabel>Expense Type</InputLabel>
          <Select 
            value={formData.type}
            onChange={(e) => handleInputChange("type", e.target.value)}
            label="Expense Type"
          >
            <MenuItem value="Staff Management">Staff Management</MenuItem>
            <MenuItem value="Warehouse Management">Warehouse Management</MenuItem>
            <MenuItem value="Supplier Relations">Supplier Relations</MenuItem>
            <MenuItem value="Item Management">Item Management</MenuItem>
            <MenuItem value="Customer Relations">Customer Relations</MenuItem>
            <MenuItem value="Stock Management">Stock Management</MenuItem>
            <MenuItem value="Purchase Management">Purchase Management</MenuItem>
            <MenuItem value="Sales Management">Sales Management</MenuItem>
            <MenuItem value="Inventory Valuation">Inventory Valuation</MenuItem>
            <MenuItem value="Damage Tracking">Damage Tracking</MenuItem>
            <MenuItem value="Invoice Management">Invoice Management</MenuItem>
            <MenuItem value="Reporting & Analytics">Reporting & Analytics</MenuItem>
          </Select>
          {errors.type && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.type}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={formData.amount}
          onChange={(e) => handleInputChange("amount", e.target.value)}
          error={!!errors.amount}
          helperText={errors.amount}
        />
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth error={!!errors.category}>
          <InputLabel>Category</InputLabel>
          <Select 
            value={formData.category}
            onChange={(e) => handleInputChange("category", e.target.value)}
            label="Category"
          >
            <MenuItem value="Staff Training">Staff Training</MenuItem>
            <MenuItem value="Warehouse Setup">Warehouse Setup</MenuItem>
            <MenuItem value="Software License">Software License</MenuItem>
            <MenuItem value="Equipment Purchase">Equipment Purchase</MenuItem>
            <MenuItem value="Travel Expense">Travel Expense</MenuItem>
            <MenuItem value="Setup Cost">Setup Cost</MenuItem>
            <MenuItem value="Compliance Cost">Compliance Cost</MenuItem>
            <MenuItem value="Development Cost">Development Cost</MenuItem>
            <MenuItem value="Maintenance Cost">Maintenance Cost</MenuItem>
            <MenuItem value="Training Cost">Training Cost</MenuItem>
            <MenuItem value="System Integration">System Integration</MenuItem>
            <MenuItem value="Consulting Services">Consulting Services</MenuItem>
          </Select>
          {errors.category && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.category}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth error={!!errors.warehouse}>
          <InputLabel>Warehouse</InputLabel>
          <Select 
            value={formData.warehouse}
            onChange={(e) => handleInputChange("warehouse", e.target.value)}
            label="Warehouse"
          >
            <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
            <MenuItem value="Branch Warehouse">Branch Warehouse</MenuItem>
            <MenuItem value="Storage Facility A">Storage Facility A</MenuItem>
            <MenuItem value="Storage Facility B">Storage Facility B</MenuItem>
            <MenuItem value="Cold Storage">Cold Storage</MenuItem>
            <MenuItem value="Distribution Center">Distribution Center</MenuItem>
          </Select>
          {errors.warehouse && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.warehouse}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          value={formData.date}
          onChange={(e) => handleInputChange("date", e.target.value)}
          InputLabelProps={{ shrink: true }}
          error={!!errors.date}
          helperText={errors.date}
        />
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth>
          <InputLabel>Claim Type</InputLabel>
          <Select 
            value={formData.claimType}
            onChange={(e) => handleInputChange("claimType", e.target.value)}
            label="Claim Type"
          >
            <MenuItem value="Advance">Advance</MenuItem>
            <MenuItem value="Reimbursement">Reimbursement</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth>
          <InputLabel>Approval Status</InputLabel>
          <Select 
            value={formData.approvalStatus}
            onChange={(e) => handleInputChange("approvalStatus", e.target.value)}
            label="Approval Status"
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth error={!!errors.paymentMode}>
          <InputLabel>Payment Mode</InputLabel>
          <Select 
            value={formData.paymentMode}
            onChange={(e) => handleInputChange("paymentMode", e.target.value)}
            label="Payment Mode"
          >
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
            <MenuItem value="Cheque">Cheque</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
          </Select>
          {errors.paymentMode && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.paymentMode}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth error={!!errors.employee}>
          <InputLabel>Employee</InputLabel>
          <Select 
            value={formData.employee}
            onChange={(e) => handleInputChange("employee", e.target.value)}
            label="Employee"
          >
            <MenuItem value="Rajesh Kumar">Rajesh Kumar</MenuItem>
            <MenuItem value="Priya Sharma">Priya Sharma</MenuItem>
            <MenuItem value="Amit Patel">Amit Patel</MenuItem>
            <MenuItem value="Sneha Gupta">Sneha Gupta</MenuItem>
            <MenuItem value="Rohit Singh">Rohit Singh</MenuItem>
            <MenuItem value="Anita Desai">Anita Desai</MenuItem>
            <MenuItem value="Vikram Joshi">Vikram Joshi</MenuItem>
            <MenuItem value="Kavita Reddy">Kavita Reddy</MenuItem>
            <MenuItem value="Arjun Mehta">Arjun Mehta</MenuItem>
            <MenuItem value="Deepika Nair">Deepika Nair</MenuItem>
            <MenuItem value="Suresh Kumar">Suresh Kumar</MenuItem>
            <MenuItem value="Meera Iyer">Meera Iyer</MenuItem>
          </Select>
          {errors.employee && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.employee}</Typography>}
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <FormControl fullWidth>
          <InputLabel>Department</InputLabel>
          <Select 
            value={formData.department}
            onChange={(e) => handleInputChange("department", e.target.value)}
            label="Department"
          >
            <MenuItem value="Staff Management">Staff Management</MenuItem>
            <MenuItem value="Warehouse Management">Warehouse Management</MenuItem>
            <MenuItem value="Supplier Relations">Supplier Relations</MenuItem>
            <MenuItem value="Item Management">Item Management</MenuItem>
            <MenuItem value="Customer Relations">Customer Relations</MenuItem>
            <MenuItem value="Stock Management">Stock Management</MenuItem>
            <MenuItem value="Purchase Management">Purchase Management</MenuItem>
            <MenuItem value="Sales Management">Sales Management</MenuItem>
            <MenuItem value="Inventory Valuation">Inventory Valuation</MenuItem>
            <MenuItem value="Damage Tracking">Damage Tracking</MenuItem>
            <MenuItem value="Invoice Management">Invoice Management</MenuItem>
            <MenuItem value="Reporting & Analytics">Reporting & Analytics</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <Box>
          <Typography variant="body2" sx={{ marginBottom: 1, color: 'text.secondary' }}>
            Attachment
          </Typography>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={(e) => handleInputChange('attachment', e.target.files[0]?.name || '')}
            className="hrms-file-input"
          />
          {formData.attachment && (
            <Typography variant="caption" sx={{ color: 'text.secondary', marginTop: 0.5, display: 'block' }}>
              Selected: {formData.attachment}
            </Typography>
          )}
        </Box>
      </Grid>
      <Grid size={{xs:12, sm:6}}>
        <TextField
          label="Vendor/Supplier"
          fullWidth
          value={formData.vendor}
          onChange={(e) => handleInputChange("vendor", e.target.value)}
          error={!!errors.vendor}
          helperText={errors.vendor}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <TextField
          label="Description"
          multiline
          rows={3}
          fullWidth
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
        />
      </Grid>
      <Grid size={{xs:12}}>
        <Box sx={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button className="hrms-btn hrms-btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="hrms-btn hrms-btn-primary" onClick={handleCreate}>
            Save
          </button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Create;