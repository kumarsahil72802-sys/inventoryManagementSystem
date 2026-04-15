'use client';

import React, { useState } from 'react';
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
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";

const FIFOLIFOWeighted = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  // Inventory Valuation data
  const [valuationData, setValuationData] = useState([
    {
      id: "VAL001",
      productName: "Samsung Galaxy S24",
      skuCode: "SGS24-128GB",
      category: "Electronics",
      currentStock: 25,
      unitCost: 42000,
      totalCost: 1050000,
      sellingPrice: 45000,
      totalValue: 1125000,
      profitMargin: 7.14,
      valuationMethod: "FIFO",
      lastUpdated: "2024-09-20",
      deadStockDays: 0,
      status: "Active"
    },
    {
      id: "VAL002",
      productName: "Dell Laptop Inspiron 15",
      skuCode: "DLI15-512GB",
      category: "Electronics",
      currentStock: 15,
      unitCost: 45000,
      totalCost: 675000,
      sellingPrice: 48000,
      totalValue: 720000,
      profitMargin: 6.67,
      valuationMethod: "LIFO",
      lastUpdated: "2024-09-18",
      deadStockDays: 0,
      status: "Active"
    },
    {
      id: "VAL003",
      productName: "Office Chair Ergonomic",
      skuCode: "OCE-001",
      category: "Furniture",
      currentStock: 8,
      unitCost: 10000,
      totalCost: 80000,
      sellingPrice: 12000,
      totalValue: 96000,
      profitMargin: 20.00,
      valuationMethod: "Weighted Average",
      lastUpdated: "2024-09-15",
      deadStockDays: 0,
      status: "Active"
    },
    {
      id: "VAL004",
      productName: "Coffee Mug Ceramic",
      skuCode: "CM-001",
      category: "Kitchenware",
      currentStock: 50,
      unitCost: 500,
      totalCost: 25000,
      sellingPrice: 750,
      totalValue: 37500,
      profitMargin: 50.00,
      valuationMethod: "FIFO",
      lastUpdated: "2024-09-20",
      deadStockDays: 0,
      status: "Active"
    }
  ]);

  const filteredValuations = valuationData.filter(valuation =>
    valuation.productName.toLowerCase().includes(search.toLowerCase()) ||
    valuation.skuCode.toLowerCase().includes(search.toLowerCase()) ||
    valuation.category.toLowerCase().includes(search.toLowerCase()) ||
    valuation.valuationMethod.toLowerCase().includes(search.toLowerCase())
  );

  const getValuationMethodColor = (method) => {
    switch (method) {
      case "FIFO":
        return "hrms-badge-primary";
      case "LIFO":
        return "hrms-badge-success";
      case "Weighted Average":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getProfitMarginColor = (margin) => {
    if (margin >= 20) return "hrms-badge-success";
    if (margin >= 10) return "hrms-badge-primary";
    if (margin >= 5) return "hrms-badge-warning";
    return "hrms-badge-error";
  };

  return (
    <div className="content-area">
      <div className="hrms-page-header">
        <h1 className="hrms-page-title">FIFO/LIFO/Weighted Average</h1>
        <p className="hrms-page-subtitle">Inventory valuation using different costing methods</p>
      </div>
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search valuations..."
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
          Add Valuation
        </button>
      </Box>

      {/* Valuation Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU Code</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Cost</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Profit Margin</TableCell>
                <TableCell>Valuation Method</TableCell>
                <TableCell>Dead Stock Days</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValuations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((valuation, index) => (
                  <TableRow key={valuation.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {valuation.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>{valuation.skuCode}</TableCell>
                    <TableCell>{valuation.category}</TableCell>
                    <TableCell>{valuation.currentStock}</TableCell>
                    <TableCell>₹{valuation.unitCost.toLocaleString()}</TableCell>
                    <TableCell>₹{valuation.totalCost.toLocaleString()}</TableCell>
                    <TableCell>₹{valuation.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>₹{valuation.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getProfitMarginColor(valuation.profitMargin)}`}>
                        {valuation.profitMargin}%
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getValuationMethodColor(valuation.valuationMethod)}`}>
                        {valuation.valuationMethod}
                      </Box>
                    </TableCell>
                    <TableCell>{valuation.deadStockDays}</TableCell>
                    <TableCell>
                      <Box className="hrms-badge hrms-badge-success">
                        {valuation.status}
                      </Box>
                    </TableCell>
                    <TableCell>{valuation.lastUpdated}</TableCell>
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredValuations.length)} of {filteredValuations.length} valuation items
            </Typography>
            <Pagination
              count={Math.ceil(filteredValuations.length / rowsPerPage)}
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

export default FIFOLIFOWeighted;