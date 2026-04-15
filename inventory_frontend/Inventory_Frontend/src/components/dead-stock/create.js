"use client";
import { Button, Grid, TextField } from "@mui/material";
import { useState } from "react";

const CreateProduct = ({onClose,onSave}) => {
    const [formData,setFormData]=useState({
       
        productName:"",
        Category:"",
       currentStockValue:"",
        lastSaleDate:"",
      
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
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="currentStockValue"
            name="currentStockValue"
            value={formData.currentStockValue}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="Last Sale Date"
            name="lastSaleDate"
            value={formData.lastSaleDate}
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