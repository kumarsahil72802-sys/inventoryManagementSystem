import React from "react";
import { Box, Typography } from "@mui/material";

const DeleteCapacity = ({ capacity, handleDelete, handleClose }) => {
  return (
    <Box sx={{ padding: "1rem 0" }}>
      <Typography variant="body1" sx={{ mb: 2, color: "#374151", fontSize: "0.95rem" }}>
        Are you sure you want to delete the capacity plan{" "}
        <Typography component="span" sx={{ fontWeight: 600, color: "#1f2937" }}>
          &quot;{capacity?.warehouseName}&quot;
        </Typography>
        ?
      </Typography>
      <Box sx={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end", marginTop: "1rem" }}>
        <button className="hrms-btn hrms-btn-secondary" onClick={handleClose}>
          Cancel
        </button>
        <button 
          className="hrms-btn hrms-btn-error" 
          onClick={handleDelete}
        >
          Delete
        </button>
      </Box>
    </Box>
  );
};

export default DeleteCapacity;
