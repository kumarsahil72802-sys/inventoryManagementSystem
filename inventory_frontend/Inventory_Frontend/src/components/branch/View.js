import { Grid, Typography, Chip } from "@mui/material";

const ViewBranch = ({ branchData }) => {
  if (!branchData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      case "Under Maintenance":
        return "warning";
      default:
        return "default";
    }
  };

  const getBranchTypeColor = (type) => {
    switch (type) {
      case "Head Office":
        return "primary";
      case "Regional Office":
        return "success";
      case "Branch":
        return "default";
      case "Warehouse":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Branch Code
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {branchData.branchCode}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Status
        </Typography>
        <Chip 
          label={branchData.status} 
          color={getStatusColor(branchData.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Branch Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.branchName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Branch Type
        </Typography>
        <Chip 
          label={branchData.branchType} 
          color={getBranchTypeColor(branchData.branchType)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Manager Name
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.managerName}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Manager Email
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.managerEmail}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Phone
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.phone}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Alternate Phone
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.alternatePhone || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Branch Email
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.email}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Address
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.address}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          City
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.city}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          State
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.state}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Pincode
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.pincode}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Country
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.country}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          GST Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {branchData.gstNumber || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          PAN Number
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
          {branchData.panNumber || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Established Date
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.establishedDate || "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Employee Count
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.employeeCount != null ? branchData.employeeCount : "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Area (sq ft)
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.area != null ? branchData.area : "—"}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Rent Amount
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {branchData.rentAmount != null ? `₹${branchData.rentAmount}` : "—"}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewBranch;