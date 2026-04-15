import { Grid, Typography } from "@mui/material";

const ViewOpeningStock = ({ stockData }) => {
  if (!stockData) return null;


  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Stock ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {stockData.stockId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.productName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          SKU Code
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.skuCode}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Warehouse
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.warehouseName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Opening Quantity
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.openingQuantity}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Unit Price
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{stockData.unitPrice?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Value
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{stockData.totalValue?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Opening Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.openingDate}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Batch Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.batchNumber}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewOpeningStock;
