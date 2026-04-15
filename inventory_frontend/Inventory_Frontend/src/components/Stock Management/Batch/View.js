"use client";
import { Box, Typography, Grid, Divider, Button } from "@mui/material";

const ViewBatch = ({ batchData, onClose }) => {
  if (!batchData) return null;

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary">Product / Item</Typography>
          <Typography variant="subtitle1">{batchData.productName}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary">Batch Number</Typography>
          <Typography variant="subtitle1">{batchData.batchNumber}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary">Warehouse</Typography>
          <Typography variant="subtitle1">{batchData.warehouseName}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="body2" color="textSecondary">Supplier</Typography>
          <Typography variant="subtitle1">{batchData.supplierName || '—'}</Typography>
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Total Quantity</Typography>
          <Typography variant="subtitle1">{batchData.quantity}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Available Quantity</Typography>
          <Typography variant="subtitle1">{batchData.availableQuantity}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Reserved Quantity</Typography>
          <Typography variant="subtitle1">{batchData.reservedQuantity || 0}</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Purchase Price</Typography>
          <Typography variant="subtitle1">₹{batchData.purchasePrice}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Cost Price</Typography>
          <Typography variant="subtitle1">₹{batchData.costPrice}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Selling Price</Typography>
          <Typography variant="subtitle1">₹{batchData.sellingPrice}</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Purchase Date</Typography>
          <Typography variant="subtitle1">{batchData.purchaseDate ? new Date(batchData.purchaseDate).toLocaleDateString() : '—'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Expiry Date</Typography>
          <Typography variant="subtitle1">{batchData.expiryDate ? new Date(batchData.expiryDate).toLocaleDateString() : '—'}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="body2" color="textSecondary">Status</Typography>
          <Typography variant="subtitle1">{batchData.status}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewBatch;
