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
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Assessment,
  AttachMoney
} from '@mui/icons-material';

export default function ItemWiseSalesReport() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  // Sample data for Item-Wise Sales Report
  const itemSalesData = [
    {
      productId: "P001",
      productName: "Laptop Pro 15",
      category: "Electronics",
      totalSold: 25,
      totalRevenue: 1125000,
      avgSellingPrice: 45000,
      profitMargin: 15.5,
      lastSaleDate: "2024-01-15",
      salesTrend: "Increasing",
      topCustomer: "ABC Electronics"
    },
    {
      productId: "P002",
      productName: "Office Chair",
      category: "Furniture",
      totalSold: 45,
      totalRevenue: 360000,
      avgSellingPrice: 8000,
      profitMargin: 22.3,
      lastSaleDate: "2024-01-14",
      salesTrend: "Stable",
      topCustomer: "XYZ Corporation"
    },
    {
      productId: "P003",
      productName: "LED TV 43",
      category: "Electronics",
      totalSold: 12,
      totalRevenue: 300000,
      avgSellingPrice: 25000,
      profitMargin: 18.7,
      lastSaleDate: "2024-01-13",
      salesTrend: "Decreasing",
      topCustomer: "Tech Solutions Ltd"
    },
    {
      productId: "P004",
      productName: "Printer HP",
      category: "Electronics",
      totalSold: 18,
      totalRevenue: 216000,
      avgSellingPrice: 12000,
      profitMargin: 12.8,
      lastSaleDate: "2024-01-12",
      salesTrend: "Stable",
      topCustomer: "Office Supplies Co"
    },
    {
      productId: "P005",
      productName: "Desk Lamp",
      category: "Furniture",
      totalSold: 35,
      totalRevenue: 87500,
      avgSellingPrice: 2500,
      profitMargin: 25.4,
      lastSaleDate: "2024-01-10",
      salesTrend: "Increasing",
      topCustomer: "Home Decor Store"
    },
    {
      productId: "P006",
      productName: "Wireless Mouse",
      category: "Electronics",
      totalSold: 60,
      totalRevenue: 180000,
      avgSellingPrice: 3000,
      profitMargin: 20.1,
      lastSaleDate: "2024-01-11",
      salesTrend: "Increasing",
      topCustomer: "Computer World"
    }
  ];

  const filteredData = itemSalesData.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.productId.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const currentData = filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  const getTrendColor = (trend) => {
    switch (trend) {
      case "Increasing":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Stable":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Decreasing":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
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
        <title>Item-Wise Sales Report</title>
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
          .trend { padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .trend-increasing { background: #e8f5e8; color: #2e7d32; }
          .trend-stable { background: #e3f2fd; color: #1976d2; }
          .trend-decreasing { background: #ffebee; color: #d32f2f; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-name">VENTURING DIGITALLY</div>
          <div class="report-title">Item-Wise Sales Report</div>
          <div class="report-date">Generated on: ${new Date().toLocaleDateString()}</div>
        </div>
        
        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${itemSalesData.length}</div>
            <div class="card-label">Total Products</div>
          </div>
          <div class="card">
            <div class="card-value">${itemSalesData.reduce((sum, item) => sum + item.totalSold, 0)}</div>
            <div class="card-label">Total Units Sold</div>
          </div>
          <div class="card">
            <div class="card-value">₹${itemSalesData.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}</div>
            <div class="card-label">Total Revenue</div>
          </div>
          <div class="card">
            <div class="card-value">${(itemSalesData.reduce((sum, item) => sum + item.profitMargin, 0) / itemSalesData.length).toFixed(1)}%</div>
            <div class="card-label">Avg Profit Margin</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Units Sold</th>
              <th>Total Revenue</th>
              <th>Avg Price</th>
              <th>Profit Margin</th>
              <th>Sales Trend</th>
              <th>Last Sale</th>
              <th>Top Customer</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(item => `
              <tr>
                <td>${item.productId}</td>
                <td>${item.productName}</td>
                <td>${item.category}</td>
                <td>${item.totalSold}</td>
                <td>₹${item.totalRevenue.toLocaleString()}</td>
                <td>₹${item.avgSellingPrice.toLocaleString()}</td>
                <td>${item.profitMargin}%</td>
                <td><span class="trend trend-${item.salesTrend.toLowerCase()}">${item.salesTrend}</span></td>
                <td>${item.lastSaleDate}</td>
                <td>${item.topCustomer}</td>
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
              <TableCell sx={{ fontWeight: 'bold' }}>Units Sold</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Revenue</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Avg Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Profit Margin</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sales Trend</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Sale</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Top Customer</TableCell>
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
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                    {row.totalSold}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{row.totalRevenue.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>₹{row.avgSellingPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2e7d32' }}>
                    {row.profitMargin}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.salesTrend}
                    size="small"
                    sx={{
                      ...getTrendColor(row.salesTrend),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>{row.lastSaleDate}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.topCustomer}
                  </Typography>
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