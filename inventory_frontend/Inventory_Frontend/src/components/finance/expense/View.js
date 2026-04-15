import React from "react";
import {
  Grid,
  Typography,
  Chip,
  Box,
  Divider
} from "@mui/material";

const View = ({ viewData }) => {
  if (!viewData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const getClaimTypeColor = (type) => {
    switch (type) {
      case "Advance":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Reimbursement":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 2, color: '#1976d2' }}>
        Expense Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Expense ID
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#1976d2' }}>
            {viewData.id}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Expense Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.name}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Expense Type
          </Typography>
          <Chip
            label={viewData.type}
            size="small"
            sx={{
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              fontWeight: 500
            }}
          />
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Amount
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, color: '#d32f2f', fontSize: '1.1rem' }}>
            ₹{viewData.amount?.toLocaleString()}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Category
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.category}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Warehouse
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.warehouse}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Date
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {new Date(viewData.date).toLocaleDateString()}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Claim Type
          </Typography>
          <Chip
            label={viewData.claimType}
            size="small"
            sx={{
              ...getClaimTypeColor(viewData.claimType),
              fontWeight: 500
            }}
          />
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Approval Status
          </Typography>
          <Chip
            label={viewData.approvalStatus}
            size="small"
            sx={{
              ...getStatusColor(viewData.approvalStatus),
              fontWeight: 500
            }}
          />
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Payment Mode
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.paymentMode}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Employee
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.employee}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Department
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.department}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Vendor/Supplier
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.vendor}
          </Typography>
        </Grid>
        
        
        <Grid size={{xs:12, sm:6}}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Attachment
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.attachment || 'No attachment'}
          </Typography>
        </Grid>
        
        <Grid size={{xs:12}}>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Description
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {viewData.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default View;