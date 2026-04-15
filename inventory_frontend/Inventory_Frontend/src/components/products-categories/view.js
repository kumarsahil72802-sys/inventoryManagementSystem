import { Grid, Typography } from "@mui/material";

const ViewProduct = ({ product }) => {
  if (!product) return null;

  return (
    <Grid display="flex" flexDirection="column" container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography varient="h6" fontWeight="600">View Product Category</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography><b>Product ID:</b>{product.proID}</Typography>
        </Grid>
      <Grid item xs={6}>
        <Typography><b>Varient ID:</b>{product.varId}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Batch/Serial No.:</b>{product.batch_sNo}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Quantity:</b>{product.qty}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Manufacture Date:</b> ₹{product.manufactureDate}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Expiry Date:</b> ₹{product.expiryDate}</Typography></Grid>
      
      <Grid item xs={6}>
        <Typography><b>Purchase ID:</b>{product.purID}</Typography></Grid>
      
      <Grid item xs={6}>
        <Typography><b>Warehouse ID:</b>{product.wareID}</Typography></Grid>
      
      <Grid item xs={6}>
        < Typography><b>Sales ID:</b>{product.salesID}</Typography></Grid>
      <Grid item xs={6}>
        <Typography><b>Status:</b>{product.status}</Typography></Grid>
      
    </Grid>
  );
};

export default ViewProduct;