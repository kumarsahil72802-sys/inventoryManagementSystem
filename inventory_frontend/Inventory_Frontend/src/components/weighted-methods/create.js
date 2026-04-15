"use client";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

const CreateProduct = ({onClose,onSave}) => {
    const [formData,setFormData]=useState({
        recordId:"",
        productName:"",
        valuationMethod:"",
        qty:"",
        purchaseBatch_dateDetails:"",
        unitCost:"",
        status:""
    });
// input change handler
    const handleChange = (e) => {
        const {name,value} = e.target;
        setFormData({...formData,[name]:value});
    };
// save handler
const handleSave = ()=>{
    if(onSave){
        onSave(formData);
    }
    onClose();
};

return (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Record ID"
            name="recordId"
            value={formData.recordId}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Valuation Method"
            name="valuationMethod"
            value={formData.valuationMethod}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Quantity"
            name="qty"
            value={formData.qty}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Purchase Batch/Date Details"
            name="purchaseBatch_dateDetails"
            value={formData.purchaseBatch_dateDetails}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Unit Cost"
            name="unitCost"
            value={formData.unitCost}
            onChange={handleChange}/>
        </Grid>
         <Grid item xs={12}>
            <TextField
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12} display="flex"
        justifyContent="flex-end">
            <Button onClick={onClose} varient="outlined" sx={{mr:1}}>Cancel</Button>
            <Button onClick={handleSave} varient="contained" color="primary">Save</Button></Grid>    </Grid>
);

};
export default CreateProduct;