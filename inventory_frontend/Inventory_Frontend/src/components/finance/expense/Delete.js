import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button
} from "@mui/material";

export default function DeleteExpense({ open, onClose, expense }) {
  if (!expense) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete Expense</DialogTitle>
      <DialogContent dividers>
        <Typography>
          Are you sure you want to delete <b>{expense.expenseType}</b> (ID: {expense.id})?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={onClose}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}