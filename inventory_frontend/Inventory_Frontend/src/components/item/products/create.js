"use client";
import { Button, Grid, TextField, Typography, Divider, MenuItem, Box } from "@mui/material";
import { useState } from "react";

const CreateProduct = ({onClose,onSave}) => {
    const [formData,setFormData]=useState({
        // Basic Product Details
        productName:"",
        skuCode:"",
        productType:"",
        categoryName:"",
        subCategoryName:"",
        brandName:"",
        unitOfMeasure:"",
        description:"",
        barCode:"",
        purchasePrice:"",
        sellingPrice:"",
        discountPercent:"",
        taxRate:"",
        hsnCode:"",
        stock:"",
        reorderLevel:"",
        warehouseName:"",
        productImageUrl:"",
        status:"Active",
        
        // Variant Attributes
        size:"",
        color:"",
        material:"",
        variantQuantity:"",
        variantUnit:"",
        variantPurchasePrice:"",
        variantSellingPrice:"",
        variantDiscount:"",
        variantStock:""
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!formData.productName.trim()) tempErrors.productName = "Product name is required";
        if (!formData.skuCode.trim()) tempErrors.skuCode = "SKU code is required";
        if (!formData.categoryName.trim()) tempErrors.categoryName = "Category is required";
        if (!formData.unitOfMeasure.trim()) tempErrors.unitOfMeasure = "Unit of measure is required";
        
        if (formData.purchasePrice === "" || formData.purchasePrice < 0) tempErrors.purchasePrice = "Valid purchase price is required";
        if (formData.sellingPrice === "" || formData.sellingPrice < 0) tempErrors.sellingPrice = "Valid selling price is required";
        if (formData.stock === "" || formData.stock < 0) tempErrors.stock = "Valid stock quantity is required";
        if (!formData.warehouseName.trim()) tempErrors.warehouseName = "Warehouse is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
// input change handler
    const handleChange = (e) => {
        const {name,value} = e.target;
        setErrors(prev => ({ ...prev, [name]: "" }));
        setFormData({...formData,[name]:value});
    };
// save handler
const handleSave = ()=>{
    if (!validate()) return;
    if(onSave){
        onSave(formData);
    }
    onClose();
};

return (
    <Box sx={{ maxHeight: '70vh', overflowY: 'auto', p: 2 }}>
        <Typography variant="h6" gutterBottom>Product Details</Typography>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="1) Product Name *"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    error={!!errors.productName}
                    helperText={errors.productName}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="2) SKU Code *"
                    name="skuCode"
                    value={formData.skuCode}
                    onChange={handleChange}
                    error={!!errors.skuCode}
                    helperText={errors.skuCode}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="3) Product Type"
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="4) Category Name *"
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    error={!!errors.categoryName}
                    helperText={errors.categoryName}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="5) Sub Category Name"
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="6) Brand Name"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="7) Unit of Measure *"
                    name="unitOfMeasure"
                    value={formData.unitOfMeasure}
                    onChange={handleChange}
                    error={!!errors.unitOfMeasure}
                    helperText={errors.unitOfMeasure}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="8) Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="9) Bar Code"
                    name="barCode"
                    value={formData.barCode}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="10) Purchase Price *"
                    name="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    error={!!errors.purchasePrice}
                    helperText={errors.purchasePrice}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="11) Selling Price *"
                    name="sellingPrice"
                    type="number"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    error={!!errors.sellingPrice}
                    helperText={errors.sellingPrice}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="12) Discount Percent"
                    name="discountPercent"
                    type="number"
                    value={formData.discountPercent}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="13) Tax Rate"
                    name="taxRate"
                    type="number"
                    value={formData.taxRate}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="14) HSN Code"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="15) Stock *"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    error={!!errors.stock}
                    helperText={errors.stock}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="16) Reorder Level"
                    name="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="17) Warehouse Name *"
                    name="warehouseName"
                    value={formData.warehouseName}
                    onChange={handleChange}
                    error={!!errors.warehouseName}
                    helperText={errors.warehouseName}
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="18) Product Image URL"
                    name="productImageUrl"
                    value={formData.productImageUrl}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    select
                    fullWidth
                    label="19) Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
            </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Variant Attributes</Typography>
        <Grid container spacing={2}>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="1.1) Size"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="1.2) Color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={4}>
                <TextField
                    fullWidth
                    label="1.3) Material"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="2) Quantity"
                    name="variantQuantity"
                    type="number"
                    value={formData.variantQuantity}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="3) Unit"
                    name="variantUnit"
                    value={formData.variantUnit}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="4) Purchase Price"
                    name="variantPurchasePrice"
                    type="number"
                    value={formData.variantPurchasePrice}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="5) Selling Price"
                    name="variantSellingPrice"
                    type="number"
                    value={formData.variantSellingPrice}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="6) Discount"
                    name="variantDiscount"
                    type="number"
                    value={formData.variantDiscount}
                    onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    fullWidth
                    label="7) Stock"
                    name="variantStock"
                    type="number"
                    value={formData.variantStock}
                    onChange={handleChange}/>
            </Grid>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <Button onClick={onClose} variant="outlined" sx={{mr:1}}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </Grid>
    </Box>
);

};
export default CreateProduct;