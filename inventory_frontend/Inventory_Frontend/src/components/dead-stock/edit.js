"use client";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

const EditProduct=(
    {product,onCancel,onUpdate}
)=>{
    


        const [formData, setFormData] = useState({
  productName: product?.productName || "",
  category: product?.category || "",
  currentStockQty: product?.currentStockQty || "",
  lastSaleDate: product?.lastSaleDate || "",
  status: product?.status || ""
  
});

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name]:
            e.target.value
        });
    };


    return(
        <Grid container spacing={2} p={2}>
            <Grid item xs={12}>
                <Typography variant="h6" fontWeight="600">
                    Edit Dead Stocks
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Product Name"
                name="productName"
                value={formData.productName}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                 fullWidth 
                 label="Category"
                  name="category"
                   value={formData.category} 
                   onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                 fullWidth 
                 label="Current Stock Quantity"
                  name="currentStockQty"
                   value={formData.currentStockQty} 
                   onChange={handleChange}/>
            </Grid>
            <Grid item xs={6}>
                <TextField
                 fullWidth 
                 label="Last Sale Date"
                  name="lastSaleDate"
                   value={formData.lastSaleDate} 
                   onChange={handleChange}/>
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
                <Button variant="contained" color="primary" onClick={()=>onUpdate(formData)}>Update</Button>
            </Grid>
        </Grid>
    );
};
export default EditProduct;