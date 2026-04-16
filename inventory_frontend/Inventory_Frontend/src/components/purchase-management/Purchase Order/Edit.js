"use client";
import { Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState, useEffect } from "react";
import { fetchSuppliers } from '../../../lib/supplierApi';
import { fetchItems } from '../../../lib/itemApi';

const EditPurchaseOrder = ({ editData, handleUpdate, handleClose }) => {
  const [formData, setFormData] = useState({
    orderDate: "",
    supplierName: "",
    productName: "",
    quantity: "",
    unitPrice: "",
    totalAmount: "",
    paymentTerms: "",
    shippingAddress: "",
    notes: "",
    status: "Pending"
  });

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const paymentTerms = [
    "Net 30",
    "Net 15",
    "Net 60",
    "Cash on Delivery",
    "Advance Payment"
  ];

  const statuses = [
    "Pending",
    "Approved",
    "Delivered"
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersRes, productsRes] = await Promise.all([
          fetchSuppliers(),
          fetchItems(1, 100)
        ]);
        setSuppliers(suppliersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (editData) {
      setFormData({
        orderDate: editData.orderDate || '',
        supplierName: editData.supplierName || '',
        productName: editData.productName || '',
        quantity: editData.quantity || '',
        unitPrice: editData.unitPrice || '',
        totalAmount: editData.totalAmount || '',
        paymentTerms: editData.paymentTerms || '',
        shippingAddress: editData.shippingAddress || '',
        notes: editData.notes || '',
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
    if (!formData.orderDate || !formData.supplierName || !formData.productName || !formData.quantity || !formData.unitPrice || !formData.totalAmount) {
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
          label="Order Date"
          type="date"
          name="orderDate"
          value={formData.orderDate}
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
              <MenuItem key={supplier.id || supplier._id} value={supplier.supplierName || supplier.name}>
                {supplier.supplierName || supplier.name}
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
              <MenuItem key={product.id || product._id} value={product.productName || product.name}>
                {product.productName || product.name}
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
          <InputLabel>Payment Terms</InputLabel>
          <Select
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
          >
            {paymentTerms.map((term) => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Shipping Address"
          name="shippingAddress"
          value={formData.shippingAddress}
          onChange={handleChange}
          required
        />
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
        <TextField
          fullWidth
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={3}
        />
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

export default EditPurchaseOrder;