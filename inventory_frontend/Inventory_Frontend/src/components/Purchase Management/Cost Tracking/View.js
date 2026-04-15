"use client";
import { Box, Grid, Typography, Chip } from "@mui/material";

const ViewCostTracking = ({ viewData }) => {
  const getChangeTypeColor = (changeType) => {
    switch (changeType) {
      case "Increased": return "error";
      case "Decreased": return "success";
      default: return "default";
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Date
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.date}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Supplier Name
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {viewData.supplierName}
          </Typography>
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
            Old Price
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ₹{viewData.oldPrice?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            New Price
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ₹{viewData.newPrice?.toLocaleString()}
          </Typography>
        </Grid>
        <Grid size={6}>
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
            Change Type
          </Typography>
          <Chip 
            label={viewData.changeType} 
            color={getChangeTypeColor(viewData.changeType)}
            sx={{ mb: 2 }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewCostTracking;
