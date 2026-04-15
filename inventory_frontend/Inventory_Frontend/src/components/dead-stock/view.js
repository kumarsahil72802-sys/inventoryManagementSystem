import { Grid, Typography } from "@mui/material";

const ViewProduct = ({ product }) => {
  if (!product) return null;

  return (
    <Grid display="flex" flexDirection="column" container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="600">View Dead Stocks</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><b>Record ID:</b>{product.recordId}</Typography>
        </Grid>
      <Grid item xs={12}>
        <Typography><b>Product Name:</b>{product.productName}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Category:</b>{product.category}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Current Stock Quantity:</b>{product.currentStockQty}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Last Sale Date:</b> ₹{product.lastSaleDate}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Days since Last Date:</b> ₹{product.daysSinceLastDate}</Typography></Grid>
      
      <Grid item xs={12}>
        <Typography><b>Stock Value:</b>{product.stockValue}</Typography></Grid>
        
       <Grid item xs={12}>
        <Typography><b>Status:</b>{product.status}</Typography></Grid>
      
    </Grid>
  );
};

export default ViewProduct;