import { Grid, Typography, Chip } from "@mui/material";

const ViewStockOut = ({ stockData }) => {
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

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case "Sale":
        return "success";
      case "Return to Supplier":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Stock Out ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {stockData.stockOutId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Transaction Type
        </Typography>
        <Chip 
          label={stockData.transactionType} 
          color={getTransactionTypeColor(stockData.transactionType)}
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
          Quantity Out
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.quantityOut}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Selling Price (per)
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{stockData.sellingPrice}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Sale
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{stockData.totalSale}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.customerName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Date of Stock Out
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.dateOfStockOut}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Mode
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {stockData.paymentMode}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewStockOut;
