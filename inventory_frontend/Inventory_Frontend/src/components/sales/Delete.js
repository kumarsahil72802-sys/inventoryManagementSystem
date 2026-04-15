import { Typography, Alert } from "@mui/material";

const DeleteSales = ({ salesData, onClose, onDelete }) => {
  if (!salesData) return null;

  return (
    <Alert severity="warning" sx={{ mb: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        Warning: This action cannot be undone!
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Are you sure you want to delete the sales order &quot;{salesData.salesOrderId}&quot;?
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        This will permanently remove:
      </Typography>
      <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
        <li>Sales order details</li>
        <li>Customer information</li>
        <li>Payment records</li>
        <li>All associated data</li>
      </ul>
    </Alert>
  );
};

export default DeleteSales;
