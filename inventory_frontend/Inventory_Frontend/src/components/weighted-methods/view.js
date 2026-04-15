import { Grid, Typography } from "@mui/material";

const ViewProduct = ({ product }) => {
  if (!product) return null;

  return (
    <Grid display="flex" flexDirection="column" container spacing={2} p={2}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight="600">View Weighted Average methods</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography><b>Record ID:</b>{product.recordId}</Typography>
        </Grid>
      <Grid item xs={12}>
        <Typography><b>Product Name:</b>{product.productName}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Valuation Method:</b>{product.valuationMethod}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Quantity:</b>{product.qty}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Unit Cost:</b> ₹{product.unitCost}</Typography></Grid>
      <Grid item xs={12}>
        <Typography><b>Total Value:</b> ₹{product.totalValue}</Typography></Grid>
      
      <Grid item xs={12}>
        <Typography><b>Calculation Date:</b>{product.dateOfCalculation}</Typography></Grid>
        
       <Grid item xs={12}>
        <Typography><b>Status:</b>{product.status}</Typography></Grid>
      
    </Grid>
  );
};

export default ViewProduct;