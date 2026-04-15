import { Grid, Typography, Chip } from "@mui/material";

const ViewSales = ({ salesData }) => {
  if (!salesData) return null;

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Processing":
        return "warning";
      case "Pending":
        return "default";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Partial":
        return "warning";
      case "Pending":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Sales Order ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {salesData.salesOrderId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Order Status
        </Typography>
        <Chip 
          label={salesData.orderStatus} 
          color={getOrderStatusColor(salesData.orderStatus)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.customerName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Email
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.customerEmail}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Phone
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.customerPhone}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Order Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.orderDate}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Delivery Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.deliveryDate}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{salesData.totalAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Paid Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{salesData.paidAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Pending Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{salesData.pendingAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Status
        </Typography>
        <Chip 
          label={salesData.paymentStatus} 
          color={getPaymentStatusColor(salesData.paymentStatus)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Method
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.paymentMethod}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Sales Person
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.salesPerson}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Delivery Address
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.deliveryAddress}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {salesData.notes || "No notes available"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewSales;
