"use client";
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Grid
} from "@mui/material";

export default function ViewIncome({ open, onClose, income }) {
  if (!income) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>View Income</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {Object.entries(income).map(([key, value]) => (
            <Grid item xs={6} key={key}>
              <Typography variant="subtitle2">{key}</Typography>
              <Typography variant="body1">{value}</Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}