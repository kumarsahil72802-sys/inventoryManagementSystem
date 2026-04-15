"use client";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";

const EditProduct=(
    {product,onCancel,onUpdate}
)=>{
    


        const [formData, setFormData] = useState({
  qty: product?.qty || "",
  manufactureDate: product?.manufactureDate || "",
  expiryDate: product?.expiryDate || "",
  wareID: product?.wareID|| "",
  status: product?.status || "",
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
                    Edit Product Category
                </Typography>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Quantity"
                name="qty"
                value={formData.qty}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField 
                fullWidth
                 label="Manufacture Date"
                  name="manufactureDate"
                   value={formData.manufactureDate}
                    onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Expiry Date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}/>
            </Grid>

            <Grid item xs={6}>
                <TextField
                fullWidth
                label="Warehouse ID"
                name="wareID"
                value={formData.wareID}
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