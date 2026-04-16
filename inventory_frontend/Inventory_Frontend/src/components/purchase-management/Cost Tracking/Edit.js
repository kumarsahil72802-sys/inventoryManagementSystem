"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

const EditCostTracking = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    supplierName: "",
    productName: "",
    oldPrice: "",
    newPrice: "",
    changeType: ""
  });

  const products = [
    "Laptop Pro 15",
    "Office Chair",
    "LED TV 43",
    "Gaming Mouse",
    "Wireless Keyboard"
  ];

  const suppliers = [
    "ABC Suppliers",
    "XYZ Electronics",
    "Tech Solutions",
    "Office Furniture Co",
    "Gaming Accessories Ltd"
  ];

  const changeTypes = [
    "Increased",
    "Decreased"
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        date: editData.date || '',
        supplierName: editData.supplierName || '',
        productName: editData.productName || '',
        oldPrice: editData.oldPrice || '',
        newPrice: editData.newPrice || '',
        changeType: editData.changeType || ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.date || !formData.supplierName || !formData.productName || !formData.oldPrice || !formData.newPrice || !formData.changeType) {
      alert('Please fill all required fields');
      return;
    }
    handleUpdate({ ...editData, ...formData });
    handleClose();
  };

  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Supplier Name</InputLabel>
          <Select
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier} value={supplier}>
                {supplier}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
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
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Old Price"
          type="number"
          name="oldPrice"
          value={formData.oldPrice}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="New Price"
          type="number"
          name="newPrice"
          value={formData.newPrice}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Change Type</InputLabel>
          <Select
            name="changeType"
            value={formData.changeType}
            onChange={handleChange}
          >
            {changeTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid size={12}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            sx={{ 
              color: '#1976d2', 
              borderColor: '#1976d2',
              textTransform: 'none',
              transform: 'none'
            }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ 
              backgroundColor: '#1976d2',
              textTransform: 'none',
              transform: 'none'
            }}
          >
            Update
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default EditCostTracking;
