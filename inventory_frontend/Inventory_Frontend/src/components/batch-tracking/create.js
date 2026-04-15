"use client";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

const CreateProduct = ({onClose,onSave}) => {
    const [formData,setFormData]=useState({
        productName:"",
        varientName:"",
        batchNo:"",
        qty:"",
      manufactureDate:"",
        expiryDate:"",
        warehouseName:"",
        salesName:"",
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
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Varient Name"
            name="varientName"
            value={formData.varientName}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Batch no."
            name="batchNo"
            value={formData.batchNo}
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
            label="Manufacture Date"
            name="manufactureDate"
            value={formData.manufactureDate}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Warehouse Name"
            name="warehouseName"
            value={formData.warehouseName}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Sales Name"
            name="salesName"
            value={formData.salesName}
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