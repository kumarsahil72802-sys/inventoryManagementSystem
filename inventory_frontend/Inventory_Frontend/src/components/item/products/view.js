import { Grid, Typography } from "@mui/material";

const ViewProduct = ({ product }) => {
  if (!product) return null;

  return (
    <Grid display="flex" flexDirection="column" container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="600">View Product</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><b>Product Name:</b>{product.productName}</Typography>
        </Grid>
      <Grid item xs={12}>
        <Typography><b>SKU Code:</b>{product.SKUcode}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Product Type:</b>{product.type}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Bar Code:</b>{product.BarCode}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Purchase Price:</b> ₹{product.purPrice}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Selling Price:</b> ₹{product.sellPrice}</Typography></Grid>
      
      <Grid item xs={12}>
        <Typography><b>Tax Rate:</b>{product.taxRate}</Typography></Grid>
      
      <Grid item xs={12}>
        <Typography><b>Stock:</b>{product.stock}</Typography></Grid>
      
      <Grid item xs={12}>
        < Typography><b>Warehouse:</b>{product.warehouseName}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Status:</b>{product.status}</Typography></Grid>
      
    </Grid>
  );
};

export default ViewProduct;