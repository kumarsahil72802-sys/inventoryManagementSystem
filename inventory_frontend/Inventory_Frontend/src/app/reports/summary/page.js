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
  IconButton,
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
  TrendingUp,
  TrendingDown,
  Inventory,
  Assessment
} from '@mui/icons-material';

export default function StockSummaryReport() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Sample data for Stock Summary Report
  const stockSummaryData = [
    {
      productId: "P001",
      productName: "Laptop Pro 15",
      category: "Electronics",
      currentStock: 45,
      reservedStock: 12,
      availableStock: 33,
      unitCost: 45000,
      totalValue: 1485000,
      lastMovement: "2024-01-15",
      status: "In Stock",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P002", 
      productName: "Office Chair",
      category: "Furniture",
      currentStock: 25,
      reservedStock: 5,
      availableStock: 20,
      unitCost: 8000,
      totalValue: 160000,
      lastMovement: "2024-01-14",
      status: "Low Stock",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P003",
      productName: "LED TV 43",
      category: "Electronics", 
      currentStock: 8,
      reservedStock: 3,
      availableStock: 5,
      unitCost: 25000,
      totalValue: 125000,
      lastMovement: "2024-01-13",
      status: "Critical",
      warehouse: "Main Warehouse"
    },
    {
      productId: "P004",
      productName: "Printer HP",
      category: "Electronics",
      currentStock: 15,
      reservedStock: 2,
      availableStock: 13,
      unitCost: 12000,
      totalValue: 156000,
      lastMovement: "2024-01-12",
      status: "In Stock",
      warehouse: "Branch Warehouse"
    },
    {
      productId: "P005",
      productName: "Desk Lamp",
      category: "Furniture",
      currentStock: 0,
      reservedStock: 0,
      availableStock: 0,
      unitCost: 2500,
      totalValue: 0,
      lastMovement: "2024-01-10",
      status: "Out of Stock",
      warehouse: "Main Warehouse"
    }
  ];

  const filteredData = stockSummaryData.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.productId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const currentData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Low Stock":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Critical":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Out of Stock":
        return { backgroundColor: "#f5f5f5", color: "#666" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  const handleDownload = () => {
    // Generate and download PDF report
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Stock Summary Report</title>
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
          .status-in-stock { background: #e8f5e8; color: #2e7d32; }
          .status-low-stock { background: #fff3e0; color: #f57c00; }
          .status-critical { background: #ffebee; color: #d32f2f; }
          .status-out-of-stock { background: #f5f5f5; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">VENTURING DIGITALLY</div>
          <div class="report-title">Stock Summary Report</div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${stockSummaryData.length}</div>
            <div class="card-label">Total Products</div>
          </div>
          <div class="card">
            <div class="card-value">${stockSummaryData.reduce((sum, item) => sum + item.currentStock, 0)}</div>
            <div class="card-label">Total Stock</div>
          </div>
          <div class="card">
            <div class="card-value">₹${stockSummaryData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}</div>
            <div class="card-label">Total Value</div>
          </div>
          <div class="card">
            <div class="card-value">${stockSummaryData.filter(item => item.status === 'Out of Stock').length}</div>
            <div class="card-label">Out of Stock</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Available Stock</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Status</th>
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
                <td>${item.availableStock}</td>
                <td>₹${item.unitCost.toLocaleString()}</td>
                <td>₹${item.totalValue.toLocaleString()}</td>
                <td><span class="status status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span></td>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Reserved</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Available</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                <TableCell>{row.reservedStock}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                    {row.availableStock}
                  </Typography>
                </TableCell>
                <TableCell>₹{row.unitCost.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{row.totalValue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      ...getStatusColor(row.status),
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