import { Grid, Typography, Chip } from "@mui/material";

const ViewCustomer = ({ customerData }) => {
  if (!customerData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
      case "Blocked":
        return "error";
      default:
        return "default";
    }
  };

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case "Corporate":
        return "primary";
      case "Wholesale":
        return "success";
      case "Retail":
        return "default";
      case "Individual":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer ID
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {customerData.customerId}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Status
        </Typography>
        <Chip 
          label={customerData.status} 
          color={getStatusColor(customerData.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.customerName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Company Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.companyName || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Email
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.email}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Phone
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.phone}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Address
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.address}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          City
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.city}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          State
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.state}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Pincode
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.pincode}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          GST Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {customerData.gstNumber || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          PAN Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {customerData.panNumber || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Credit Limit
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.creditLimit != null ? customerData.creditLimit : "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Payment Terms
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.paymentTerms || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Customer Type
        </Typography>
        <Chip 
          label={customerData.customerType} 
          color={getCustomerTypeColor(customerData.customerType)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Orders
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.totalOrders != null ? customerData.totalOrders : "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Total Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {customerData.totalAmount != null ? customerData.totalAmount : "—"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewCustomer;