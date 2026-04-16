"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";

const EditPurchaseReturn = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    returnDate: "",
    supplierName: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    reason: "",
    originalOrderId: "",
    status: "Pending"
  });

  const products = [
    "Laptop Pro 15",
    "Office Chair",
    "LED TV 43",
    "Samsung Galaxy S24",
    "Dell Laptop Inspiron 15",
    "iPhone 15 Pro"
  ];

  const suppliers = [
    "ABC Suppliers",
    "XYZ Electronics", 
    "Tech Solutions",
    "Office Furniture Co",
    "Gaming Accessories Ltd"
  ];

  const orderIds = [
    "PO001",
    "PO002", 
    "PO003",
    "PO004",
    "PO005"
  ];

  const reasons = [
    "Defective Product",
    "Wrong Item",
    "Damaged in Transit",
    "Quality Issues",
    "Customer Request",
    "Overstock"
  ];

  const statuses = [
    "Pending",
    "Approved",
    "Processed"
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        returnDate: editData.returnDate || '',
        supplierName: editData.supplierName || '',
        productName: editData.productName || '',
        quantity: editData.quantity || '',
        unitPrice: editData.unitPrice || '',
        totalAmount: editData.totalAmount || '',
        reason: editData.reason || '',
        originalOrderId: editData.originalOrderId || '',
        status: editData.status || 'Pending'
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-calculate total amount
    if (name === "quantity" || name === "unitPrice") {
      const quantity = name === "quantity" ? value : formData.quantity;
      const price = name === "unitPrice" ? value : formData.unitPrice;
      if (quantity && price) {
        setFormData(prev => ({ ...prev, totalAmount: (parseFloat(quantity) * parseFloat(price)).toString() }));
      }
    }
  };

  const handleSave = () => {
    if (!formData.returnDate || !formData.supplierName || !formData.productName || !formData.quantity || !formData.unitPrice || !formData.totalAmount) {
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
          label="Return Date"
          type="date"
          name="returnDate"
          value={formData.returnDate}
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
          label="Quantity"
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Unit Price"
          type="number"
          name="unitPrice"
          value={formData.unitPrice}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Total Amount"
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          required
          disabled
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Original Order ID</InputLabel>
          <Select
            name="originalOrderId"
            value={formData.originalOrderId}
            onChange={handleChange}
          >
            {orderIds.map((orderId) => (
              <MenuItem key={orderId} value={orderId}>
                {orderId}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Reason</InputLabel>
          <Select
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          >
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>
                {reason}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12}>
        <FormControl fullWidth required>
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
        </FormControl>
      </Grid>
      
      <Grid size={12}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            sx={{ transform: 'none', textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ transform: 'none', textTransform: 'none' }}
          >
            Update
          </Button>
        </div>
      </Grid>
    </Grid>
  );
};

export default EditPurchaseReturn;