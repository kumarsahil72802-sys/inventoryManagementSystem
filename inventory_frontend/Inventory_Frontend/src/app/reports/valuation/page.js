'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Pagination
} from '@mui/material';
import {
  Search,
  Download,
  Print,
  FilterList,
  Assessment,
  TrendingUp,
  Inventory,
  AttachMoney,
  Calculate
} from '@mui/icons-material';

export default function ValuationReport() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Sample data for Valuation Report
  const valuationData = [
    {
      productId: "P001",
      productName: "Laptop Pro 15",
      category: "Electronics",
      currentStock: 45,
      unitCost: 45000,
      totalCost: 2025000,
      marketValue: 4725000,
      valuationMethod: "FIFO",
      grossProfit: 2700000,
      profitMargin: 57.1,
      lastValuation: "2024-01-15",
      valuationStatus: "Current",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P002",
      productName: "Office Chair",
      category: "Furniture",
      currentStock: 25,
      unitCost: 8000,
      totalCost: 200000,
      marketValue: 250000,
      valuationMethod: "Weighted Average",
      grossProfit: 50000,
      profitMargin: 25.0,
      lastValuation: "2024-01-14",
      valuationStatus: "Current",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P003",
      productName: "LED TV 43",
      category: "Electronics",
      currentStock: 8,
      unitCost: 25000,
      totalCost: 200000,
      marketValue: 180000,
      valuationMethod: "LIFO",
      grossProfit: -20000,
      profitMargin: -10.0,
      lastValuation: "2024-01-13",
      valuationStatus: "Depreciated",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P004",
      productName: "Printer HP",
      category: "Electronics",
      currentStock: 15,
      unitCost: 12000,
      totalCost: 180000,
      marketValue: 195000,
      valuationMethod: "FIFO",
      grossProfit: 15000,
      profitMargin: 8.3,
      lastValuation: "2024-01-12",
      valuationStatus: "Current",
      warehouse: "Branch Warehouse"
    },
    {
      productId: "P005",
      productName: "Desk Lamp",
      category: "Furniture",
      currentStock: 0,
      unitCost: 2500,
      totalCost: 0,
      marketValue: 0,
      valuationMethod: "Weighted Average",
      grossProfit: 0,
      profitMargin: 0,
      lastValuation: "2024-01-10",
      valuationStatus: "Sold Out",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P006",
      productName: "Wireless Mouse",
      category: "Electronics",
      currentStock: 60,
      unitCost: 3000,
      totalCost: 180000,
      marketValue: 240000,
      valuationMethod: "FIFO",
      grossProfit: 60000,
      profitMargin: 33.3,
      lastValuation: "2024-01-11",
      valuationStatus: "Current",
      warehouse: "Main Warehouse"
    }
  ];

  const filteredData = valuationData.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.productId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const currentData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getValuationStatusColor = (status) => {
    switch (status) {
      case "Current":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Depreciated":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Sold Out":
        return { backgroundColor: "#f5f5f5", color: "#666" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "FIFO":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "LIFO":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      case "Weighted Average":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventory Valuation Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .company-name { font-size: 24px; font-weight: bold; color: #1976d2; }
          .report-title { font-size: 18px; margin: 10px 0; }
          .report-date { color: #666; }
          .summary-cards { display: flex; justify-content: space-around; margin: 20px 0; }
          .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; text-align: center; }
          .card-value { font-size: 20px; font-weight: bold; color: #1976d2; }
          .card-label { color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .status-current { background: #e8f5e8; color: #2e7d32; }
          .status-depreciated { background: #ffebee; color: #d32f2f; }
          .status-sold-out { background: #f5f5f5; color: #666; }
          .method { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .method-fifo { background: #e3f2fd; color: #1976d2; }
          .method-lifo { background: #f3e5f5; color: #7b1fa2; }
          .method-weighted-average { background: #fff3e0; color: #f57c00; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">VENTURING DIGITALLY</div>
          <div class="report-title">Inventory Valuation Report</div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">₹${valuationData.reduce((sum, item) => sum + item.totalCost, 0).toLocaleString()}</div>
            <div class="card-label">Total Cost Value</div>
          </div>
          <div class="card">
            <div class="card-value">₹${valuationData.reduce((sum, item) => sum + item.marketValue, 0).toLocaleString()}</div>
            <div class="card-label">Total Market Value</div>
          </div>
          <div class="card">
            <div class="card-value">₹${valuationData.reduce((sum, item) => sum + item.grossProfit, 0).toLocaleString()}</div>
            <div class="card-label">Total Gross Profit</div>
          </div>
          <div class="card">
            <div class="card-value">${(valuationData.reduce((sum, item) => sum + item.profitMargin, 0) / valuationData.length).toFixed(1)}%</div>
            <div class="card-label">Avg Profit Margin</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Unit Cost</th>
              <th>Total Cost</th>
              <th>Market Value</th>
              <th>Valuation Method</th>
              <th>Gross Profit</th>
              <th>Profit Margin</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.productId}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${item.currentStock}</td>
                <td>₹${item.unitCost.toLocaleString()}</td>
                <td>₹${item.totalCost.toLocaleString()}</td>
                <td>₹${item.marketValue.toLocaleString()}</td>
                <td><span class="method method-${item.valuationMethod.toLowerCase().replace(' ', '-')}">${item.valuationMethod}</span></td>
                <td>₹${item.grossProfit.toLocaleString()}</td>
                <td>${item.profitMargin}%</td>
                <td><span class="status status-${item.valuationStatus.toLowerCase().replace(' ', '-')}">${item.valuationStatus}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="content-area">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{ width: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            sx={{ textTransform: 'none' }}
          >
            Download PDF
          </Button>
        </Box>
      </Box>


      {/* Report Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: '0.75rem' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Current Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Market Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Valuation Method</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gross Profit</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Profit Margin</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.map((row, index) => (
              <TableRow key={row.productId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.productId}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.currentStock}
                  </Typography>
                </TableCell>
                <TableCell>₹{row.unitCost.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{row.totalCost.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                    ₹{row.marketValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.valuationMethod}
                    size="small"
                    sx={{
                      ...getMethodColor(row.valuationMethod),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: row.grossProfit >= 0 ? '#2e7d32' : '#d32f2f' }}>
                    ₹{row.grossProfit.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: row.profitMargin >= 0 ? '#2e7d32' : '#d32f2f' }}>
                    {row.profitMargin}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.valuationStatus}
                    size="small"
                    sx={{
                      ...getValuationStatusColor(row.valuationStatus),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
     
      {/* Pagination */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} items
          </Typography>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            size="small"
            color="primary"
          />
        </Stack>
      </Box>
      </Paper>
    </div>
  );
}