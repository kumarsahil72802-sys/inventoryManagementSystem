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
  Warning,
  Schedule,
  Inventory,
  Assessment,
  TrendingDown
} from '@mui/icons-material';

export default function StockAgingReport() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Sample data for Stock Aging Report
  const stockAgingData = [
    {
      productId: "P001",
      productName: "Laptop Pro 15",
      category: "Electronics",
      currentStock: 45,
      daysInStock: 15,
      lastMovement: "2024-01-15",
      agingCategory: "Fresh",
      totalValue: 2025000,
      depreciation: 0,
      riskLevel: "Low",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P002",
      productName: "Office Chair",
      category: "Furniture",
      currentStock: 25,
      daysInStock: 45,
      lastMovement: "2023-12-01",
      agingCategory: "30-60 Days",
      totalValue: 200000,
      depreciation: 5,
      riskLevel: "Medium",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P003",
      productName: "LED TV 43",
      category: "Electronics",
      currentStock: 8,
      daysInStock: 90,
      lastMovement: "2023-10-15",
      agingCategory: "60-90 Days",
      totalValue: 200000,
      depreciation: 12,
      riskLevel: "High",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P004",
      productName: "Printer HP",
      category: "Electronics",
      currentStock: 15,
      daysInStock: 120,
      lastMovement: "2023-09-15",
      agingCategory: "90+ Days",
      totalValue: 180000,
      depreciation: 20,
      riskLevel: "Critical",
      warehouse: "Branch Warehouse"
    },
    {
      productId: "P005",
      productName: "Desk Lamp",
      category: "Furniture",
      currentStock: 0,
      daysInStock: 0,
      lastMovement: "2024-01-10",
      agingCategory: "Sold Out",
      totalValue: 0,
      depreciation: 0,
      riskLevel: "N/A",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P006",
      productName: "Wireless Mouse",
      category: "Electronics",
      currentStock: 60,
      daysInStock: 180,
      lastMovement: "2023-07-15",
      agingCategory: "90+ Days",
      totalValue: 180000,
      depreciation: 35,
      riskLevel: "Critical",
      warehouse: "Main Warehouse"
    }
  ];

  const filteredData = stockAgingData.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.productId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const currentData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getAgingColor = (category) => {
    switch (category) {
      case "Fresh":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "30-60 Days":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "60-90 Days":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "90+ Days":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      case "Sold Out":
        return { backgroundColor: "#f5f5f5", color: "#666" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "Low":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Medium":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "High":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Critical":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
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
        <title>Stock Aging Report</title>
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
          .aging { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .aging-fresh { background: #e8f5e8; color: #2e7d32; }
          .aging-30-60-days { background: #fff3e0; color: #f57c00; }
          .aging-60-90-days { background: #ffebee; color: #d32f2f; }
          .aging-90-days { background: #f3e5f5; color: #7b1fa2; }
          .aging-sold-out { background: #f5f5f5; color: #666; }
          .risk { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .risk-low { background: #e8f5e8; color: #2e7d32; }
          .risk-medium { background: #fff3e0; color: #f57c00; }
          .risk-high { background: #ffebee; color: #d32f2f; }
          .risk-critical { background: #f3e5f5; color: #7b1fa2; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">VENTURING DIGITALLY</div>
          <div class="report-title">Stock Aging Report</div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${stockAgingData.length}</div>
            <div class="card-label">Total Products</div>
          </div>
          <div class="card">
            <div class="card-value">${stockAgingData.filter(item => item.agingCategory === '90+ Days').length}</div>
            <div class="card-label">Aged Stock (90+ Days)</div>
          </div>
          <div class="card">
            <div class="card-value">₹${stockAgingData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}</div>
            <div class="card-label">Total Stock Value</div>
          </div>
          <div class="card">
            <div class="card-value">${stockAgingData.filter(item => item.riskLevel === 'Critical').length}</div>
            <div class="card-label">Critical Risk Items</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Days in Stock</th>
              <th>Aging Category</th>
              <th>Total Value</th>
              <th>Depreciation</th>
              <th>Risk Level</th>
              <th>Last Movement</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.productId}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${item.currentStock}</td>
                <td>${item.daysInStock}</td>
                <td><span class="aging aging-${item.agingCategory.toLowerCase().replace(' ', '-').replace('+', '-days')}">${item.agingCategory}</span></td>
                <td>₹${item.totalValue.toLocaleString()}</td>
                <td>${item.depreciation}%</td>
                <td><span class="risk risk-${item.riskLevel.toLowerCase()}">${item.riskLevel}</span></td>
                <td>${item.lastMovement}</td>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Days in Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Aging Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Depreciation</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Risk Level</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Movement</TableCell>
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
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: row.daysInStock > 90 ? '#d32f2f' : row.daysInStock > 60 ? '#f57c00' : '#2e7d32' }}>
                    {row.daysInStock}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.agingCategory}
                    size="small"
                    sx={{
                      ...getAgingColor(row.agingCategory),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{row.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: row.depreciation > 20 ? '#d32f2f' : row.depreciation > 10 ? '#f57c00' : '#2e7d32' }}>
                    {row.depreciation}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.riskLevel}
                    size="small"
                    sx={{
                      ...getRiskColor(row.riskLevel),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>{row.lastMovement}</TableCell>
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