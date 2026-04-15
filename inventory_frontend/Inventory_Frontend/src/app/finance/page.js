'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { getAllIncome, getAllExpenses } from '../../lib/financeApi';

const Finance = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch finance data on component mount
  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const [incomeResponse, expensesResponse] = await Promise.all([
          getAllIncome(),
          getAllExpenses()
        ]);

        // Process income data
        const incomeData = Array.isArray(incomeResponse?.data) ? incomeResponse.data : [];
        const processedIncome = incomeData.map(income => ({
          ...income,
          transactionType: 'Income',
          transactionId: income._id || income.id,
          customerName: income.customerName,
          supplierName: income.supplierName,
          vendorName: income.vendorName,
          bankName: income.bankName
        }));

        // Process expenses data
        const expensesData = Array.isArray(expensesResponse?.data) ? expensesResponse.data : [];
        const processedExpenses = expensesData.map(expense => ({
          ...expense,
          transactionType: 'Expense',
          transactionId: expense._id || expense.id,
          customerName: expense.customerName,
          supplierName: expense.supplierName,
          vendorName: expense.vendorName,
          bankName: expense.bankName
        }));

        // Combine and sort by date (newest first)
        const combinedData = [...processedIncome, ...processedExpenses].sort(
          (a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        );

        setFinanceData(combinedData);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch finance data');
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, []);

  const filteredFinance = financeData.filter(finance =>
    finance.transactionId.toLowerCase().includes(search.toLowerCase()) ||
    finance.transactionType.toLowerCase().includes(search.toLowerCase()) ||
    finance.category.toLowerCase().includes(search.toLowerCase()) ||
    finance.status.toLowerCase().includes(search.toLowerCase())
  );

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case "Income":
        return "hrms-badge-success";
      case "Expense":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "hrms-badge-success";
      case "Pending":
        return "hrms-badge-warning";
      case "Cancelled":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Sales Revenue":
        return "hrms-badge-success";
      case "Purchase":
        return "hrms-badge-error";
      case "Operating Expense":
        return "hrms-badge-warning";
      case "Utilities":
        return "hrms-badge-primary";
      case "Other Income":
        return "hrms-badge-success";
      default:
        return "hrms-badge-neutral";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="content-area">

      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
        <button
          className="hrms-btn hrms-btn-primary"
          style={{ height: "40px" }}
        >
          <Add />
          Add Transaction
        </button>
      </Box>

      {/* Finance Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Transaction Id</TableCell>
                <TableCell>Transaction Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Customer/Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Approved By</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFinance
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((finance, index) => (
                  <TableRow key={finance.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {finance.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getTransactionTypeColor(finance.transactionType)}`}>
                        {finance.transactionType}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getCategoryColor(finance.category)}`}>
                        {finance.category}
                      </Box>
                    </TableCell>
                    <TableCell>{finance.description}</TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: finance.transactionType === "Income" ? "#2e7d32" : "#d32f2f"
                        }}
                      >
                        {finance.transactionType === "Income" ? "+" : "-"}₹{finance.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{finance.date}</TableCell>
                    <TableCell>{finance.paymentMethod}</TableCell>
                    <TableCell>{finance.reference}</TableCell>
                    <TableCell>
                      {finance.customerName || finance.supplierName || finance.vendorName || finance.bankName}
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(finance.status)}`}>
                        {finance.status}
                      </Box>
                    </TableCell>
                    <TableCell>{finance.createdBy}</TableCell>
                    <TableCell>{finance.approvedBy}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredFinance.length)} of {filteredFinance.length} transactions
            </Typography>
            <Pagination
              count={Math.ceil(filteredFinance.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Finance;
