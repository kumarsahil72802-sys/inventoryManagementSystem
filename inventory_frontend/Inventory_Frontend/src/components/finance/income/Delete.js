"use client";
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Stack
} from "@mui/material";

export default function DeleteIncome({ open, onClose, income, onConfirm }) {
  if (!income) return null;

  const handleConfirm = () => {
    onConfirm(income.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Income</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography>Are you sure you want to delete this record?</Typography>
          <Typography variant="body2"><b>ID:</b> {income.id}</Typography>
          <Typography variant="body2"><b>Income Type:</b> {income.incomeType}</Typography>
          <Typography variant="body2"><b>Amount:</b> ₹{income.amount}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}