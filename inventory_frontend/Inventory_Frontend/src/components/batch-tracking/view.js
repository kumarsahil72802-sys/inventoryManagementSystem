import { Grid, Typography } from "@mui/material";

const ViewProduct = ({ product }) => {
  if (!product) return null;

  return (
    <Grid display="flex" flexDirection="column" container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography varient="h6" fontWeight="600">View Batch No.</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography><b>Product Name:</b>{product.productName}</Typography>
        </Grid>
      <Grid item xs={6}>
        <Typography><b>Varient Name:</b>{product.varientName}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Batch No:</b>{product.batchNo}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Quantity:</b>{product.qty}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Manufacture Date:</b> ₹{product.manufactureDate}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Expiry Date:</b> ₹{product.expiryDate}</Typography></Grid>
      
      <Grid item xs={6}>
        <Typography><b>Warehouse Name:</b>{product.warehouseName}</Typography></Grid>
      
      <Grid item xs={6}>
        <Typography><b>Sales Name:</b>{product.salesName}</Typography></Grid>
      
      
      <Grid item xs={6}>
        <Typography><b>Status:</b>{product.status}</Typography></Grid>
      
    </Grid>
  );
};

export default ViewProduct;