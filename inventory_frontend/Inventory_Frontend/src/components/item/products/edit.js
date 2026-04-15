"use client";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

const EditProduct=(
    {product,onCancel,onUpdate}
)=>{
    


        const [formData, setFormData] = useState({
  productName: product?.productName || "",
  skuCode: product?.skuCode || product?.SKUcode || "",
  productType: product?.productType || product?.type || "",
  barCode: product?.barCode || product?.Barcode || "",
  purchasePrice: product?.purchasePrice || "",
  sellingPrice: product?.sellingPrice || "",
  taxRate: product?.taxRate || "",
  stock: product?.stock || "",
  warehouseName: product?.warehouseName || "",
  status: product?.status || "Active",
});

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.productName.trim()) tempErrors.productName = "Product name is required";
        if (!formData.skuCode.trim()) tempErrors.skuCode = "SKU code is required";
        if (formData.purchasePrice === "" || formData.purchasePrice < 0) tempErrors.purchasePrice = "Valid purchase price is required";
        if (formData.sellingPrice === "" || formData.sellingPrice < 0) tempErrors.sellingPrice = "Valid selling price is required";
        if (formData.stock === "" || formData.stock < 0) tempErrors.stock = "Valid stock quantity is required";
        if (!formData.warehouseName.trim()) tempErrors.warehouseName = "Warehouse is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange=(e)=>{
        const { name, value } = e.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
        setFormData({...formData,[name]: value});
    };


    return(
        <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
                <Typography variant="h6" fontWeight="600">
                    Edit Product
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Product Name *"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                error={!!errors.productName}
                helperText={errors.productName}
                required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField 
                    fullWidth 
                    label="SKU Code *" 
                    name="skuCode" 
                    value={formData.skuCode} 
                    onChange={handleChange}
                    error={!!errors.skuCode}
                    helperText={errors.skuCode}
                    required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Product type"
                name="productType"
                value={formData.productType}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Bar Code"
                name="barCode"
                value={formData.barCode}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Purchase Price *"
                name="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={handleChange}
                error={!!errors.purchasePrice}
                helperText={errors.purchasePrice}
                required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Selling Price *"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleChange}
                error={!!errors.sellingPrice}
                helperText={errors.sellingPrice}
                required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Tax Rate"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Stock *"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Warehouse Name *"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                error={!!errors.warehouseName}
                helperText={errors.warehouseName}
                required
                />
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}/>
            </Grid>

            {/* buttons */}
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" color="error" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={()=>{
                    if(validate()) onUpdate(formData);
                }}>Update</Button>
            </Grid>
        </Grid>
    );
};
export default EditProduct;