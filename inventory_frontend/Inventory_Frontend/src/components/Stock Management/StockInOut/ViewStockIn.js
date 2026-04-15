import { Grid, Typography, Chip } from "@mui/material";

const ViewStockIn = ({ stockData }) => {
  if (!stockData) return null;

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Overdue":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Stock In ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {stockData.stockInId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Status
        </Typography>
        <Chip 
          label={stockData.paymentStatus} 
          color={getPaymentStatusColor(stockData.paymentStatus)}
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
          Quantity In
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.quantityIn}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Cost
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{stockData.totalCost}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Supplier Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.supplierName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Date of Stock In
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.dateOfStockIn}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewStockIn;
