"use client";
import { Button, Grid, TextField, MenuItem } from "@mui/material";
import { useState } from "react";

const CreateProduct = ({onClose,onSave}) => {
    const [formData,setFormData]=useState({
        categoryName:"",
        description:"",
        status:"Active"
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
            label="1) Category Name"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            fullWidth
            label="2) Description"
            name="description"
            value={formData.description}
            onChange={handleChange}/>
        </Grid>
        <Grid item xs={12}>
            <TextField
            select
            fullWidth
            label="3) Status"
            name="status"
            value={formData.status}
            onChange={handleChange}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
            </TextField>
        </Grid>
        <Grid item xs={12} display="flex"
        justifyContent="flex-end">
            <Button onClick={onClose} variant="outlined" sx={{mr:1}}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
        </Grid>
    </Grid>
);

};
export default CreateProduct;