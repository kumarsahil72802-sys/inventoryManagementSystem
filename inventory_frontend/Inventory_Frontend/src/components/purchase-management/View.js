import { Grid, Typography, Chip } from "@mui/material";

const ViewPurchase = ({ purchaseData }) => {
  if (!purchaseData) return null;

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
          Purchase Order ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {purchaseData.purchaseOrderId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Order Status
        </Typography>
        <Chip 
          label={purchaseData.orderStatus} 
          color={getOrderStatusColor(purchaseData.orderStatus)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Supplier Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.supplierName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Supplier Contact
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.supplierContact}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Order Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.orderDate}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Expected Delivery Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.expectedDeliveryDate}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Actual Delivery Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.actualDeliveryDate || "Not Delivered"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{purchaseData.totalAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Paid Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{purchaseData.paidAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Pending Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          ₹{purchaseData.pendingAmount?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Status
        </Typography>
        <Chip 
          label={purchaseData.paymentStatus} 
          color={getPaymentStatusColor(purchaseData.paymentStatus)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Terms
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.paymentTerms}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Created By
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.createdBy}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Approved By
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.approvedBy}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Notes
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {purchaseData.notes || "No notes available"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewPurchase;
