import { Grid, Typography, Chip, Box, Divider } from "@mui/material";

const ViewStockTransfer = ({ transferData }) => {
  if (!transferData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "success";
      case "In Transit": return "warning";
      case "Pending": return "default";
      case "Cancelled": return "error";
      default: return "default";
    }
  };

  const Field = ({ label, value }) => (
    <Grid size={{ xs: 12, md: 6 }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>{label}</Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>{value || '—'}</Typography>
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>Transfer ID</Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>{transferData.transferId}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>Status</Typography>
        <Chip label={transferData.status} color={getStatusColor(transferData.status)} size="small" sx={{ fontWeight: 500 }} />
      </Grid>
      <Field label="From Warehouse" value={transferData.fromWarehouse} />
      <Field label="To Warehouse" value={transferData.toWarehouse} />
      <Field label="Transfer Date" value={transferData.transferDate} />
      <Field label="Expected Delivery" value={transferData.expectedDeliveryDate} />
      <Field label="Total Quantity" value={transferData.transferQuantity} />
      <Field label="Total Value" value={transferData.totalValue ? `₹${Number(transferData.totalValue).toLocaleString()}` : '—'} />
      <Field label="Reason" value={transferData.reason} />
      <Field label="Notes" value={transferData.notes} />

      {transferData.items?.length > 0 && (
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Transfer Items</Typography>
          {transferData.items.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 0.5, fontSize: '0.875rem' }}>
              <Typography variant="body2" sx={{ flex: 2 }}>
                {item.itemId?.productName || item.itemId?.name || `Item ${idx + 1}`}
              </Typography>
              <Typography variant="body2">Qty: {item.quantity}</Typography>
              <Typography variant="body2">Unit: {item.unit}</Typography>
              {item.costPrice ? <Typography variant="body2">₹{item.costPrice}/unit</Typography> : null}
            </Box>
          ))}
        </Grid>
      )}
    </Grid>
  );
};

export default ViewStockTransfer;
