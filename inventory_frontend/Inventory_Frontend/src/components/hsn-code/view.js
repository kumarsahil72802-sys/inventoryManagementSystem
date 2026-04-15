import { Grid, Typography, Chip } from "@mui/material";

const ViewHSN = ({ hsnData }) => {
  if (!hsnData) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          HSN/SAC Code
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
          {hsnData.hsnCode}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Tax Rate
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {hsnData.taxRate}%
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Category
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {hsnData.category}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Subcategory
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {hsnData.subCategory}
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Status
        </Typography>
        <Chip 
          label={hsnData.status} 
          color={getStatusColor(hsnData.status)}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', mb: 0.5 }}>
          Description
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {hsnData.description}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ViewHSN;
