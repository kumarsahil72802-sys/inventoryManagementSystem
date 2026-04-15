import { Grid, Typography, Chip } from "@mui/material";

const ViewStockInOut = ({ stockData }) => {
  if (!stockData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "success";
      case "Low Stock":
        return "warning";
      case "Out of Stock":
        return "error";
      default:
        return "default";
    }
  };

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
          Status
        </Typography>
        <Chip 
          label={stockData.status} 
          color={getStatusColor(stockData.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
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
          Current Stock
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.currentStock}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Available Stock
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.availableStock}
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
          Batch Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.batchNumber}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewStockInOut;
