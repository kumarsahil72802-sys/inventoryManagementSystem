"use client";
import React from "react";
import {
  Grid,
  Typography,
  Chip,
} from "@mui/material";

const ViewWriteOff = ({ viewData, handleClose }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Completed":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Write-off Number
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.writeOffNumber}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Status
        </Typography>
        <Chip
          label={viewData.status}
          size="small"
          sx={{
            ...getStatusColor(viewData.status),
            fontWeight: 500,
            mb: 2
          }}
        />
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Product Name
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.productName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Warehouse
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.warehouseName}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Write-off Date
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.writeOffDate}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Write-off Reason
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.writeOffReason}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Quantity
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.quantity}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Unit Cost
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.unitCost?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Total Value
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.totalValue?.toLocaleString()}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Recovery Amount
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          ₹{viewData.recoveryAmount?.toLocaleString() || 0}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Disposal Method
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.disposalMethod}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Financial Impact
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.financialImpact}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Created By
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.createdBy}
        </Typography>
      </Grid>
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Related Damage ID
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.damageId?.damageId || viewData.damageId}
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
          Reason Description
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {viewData.reasonDescription}
        </Typography>
      </Grid>
      {viewData.disposalDetails && (
        <Grid size={12}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Disposal Details
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.disposalDetails}
          </Typography>
        </Grid>
      )}
      {viewData.notes && (
        <Grid size={12}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Notes
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.notes}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ViewWriteOff;
