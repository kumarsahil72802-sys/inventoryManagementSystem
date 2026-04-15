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
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert
} from "@mui/material";
import { Search, VisibilityOutlined, DownloadOutlined, AssessmentOutlined, TrendingUpOutlined, InventoryOutlined, AttachMoneyOutlined } from "@mui/icons-material";
import { getStockSummary, getItemSales } from '@/lib/reportsApi';
import { getAllPurchaseOrders } from '@/lib/purchaseApi';
import { getAllIncome, getAllExpenses } from '@/lib/financeApi';
import { apiClient } from '@/lib/api';

const Reports = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reports data based on spreadsheet specifications
  const [reportsData, setReportsData] = useState([
    {
      id: "RPT001",
      reportId: "RPT001",
      reportName: "Sales Summary Report",
      reportType: "Sales",
      period: "September 2024",
      generatedDate: "2024-09-25",
      generatedBy: "Priya Singh",
      totalSales: 92000,
      totalOrders: 3,
      averageOrderValue: 30667,
      status: "Generated",
      fileSize: "2.5 MB",
      format: "PDF"
    },
    {
      id: "RPT002",
      reportId: "RPT002",
      reportName: "Inventory Valuation Report",
      reportType: "Inventory",
      period: "September 2024",
      generatedDate: "2024-09-24",
      generatedBy: "Ayush Kumar",
      totalValue: 2500000,
      totalItems: 6,
      averageValue: 416667,
      status: "Generated",
      fileSize: "1.8 MB",
      format: "Excel"
    },
    {
      id: "RPT003",
      reportId: "RPT003",
      reportName: "Purchase Analysis Report",
      reportType: "Purchase",
      period: "September 2024",
      generatedDate: "2024-09-23",
      generatedBy: "Nysa Mittal",
      totalPurchases: 328500,
      totalOrders: 3,
      averageOrderValue: 109500,
      status: "Generated",
      fileSize: "1.2 MB",
      format: "PDF"
    },
    {
      id: "RPT004",
      reportId: "RPT004",
      reportName: "Financial Summary Report",
      reportType: "Finance",
      period: "September 2024",
      generatedDate: "2024-09-22",
      generatedBy: "Rajesh Kumar",
      totalIncome: 82500,
      totalExpense: 161000,
      netProfit: -78500,
      status: "Generated",
      fileSize: "3.1 MB",
      format: "PDF"
    },
    {
      id: "RPT005",
      reportId: "RPT005",
      reportName: "Damage & Loss Report",
      reportType: "Damage",
      period: "September 2024",
      generatedDate: "2024-09-21",
      generatedBy: "Amit Patel",
      totalLoss: 146600,
      totalIncidents: 5,
      averageLoss: 29320,
      status: "Generated",
      fileSize: "0.9 MB",
      format: "Excel"
    },
    {
      id: "RPT006",
      reportId: "RPT006",
      reportName: "Stock Movement Report",
      reportType: "Stock",
      period: "September 2024",
      generatedDate: "2024-09-20",
      generatedBy: "Priya Sharma",
      totalMovements: 15,
      inStock: 110,
      outStock: 8,
      status: "Generated",
      fileSize: "1.5 MB",
      format: "Excel"
    }
  ]);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);
        const [
          stockRes,
          salesRes,
          purchaseRes,
          incomeRes,
          expenseRes,
          damageRes,
          stockMovementRes
        ] = await Promise.all([
          getStockSummary(),
          getItemSales(),
          getAllPurchaseOrders(),
          getAllIncome(),
          getAllExpenses(),
          apiClient.get('/damage'),
          apiClient.get('/stock/transactions')
        ]);
        
        const stockData = Array.isArray(stockRes?.data) ? stockRes.data : [];
        const salesData = Array.isArray(salesRes?.data) ? salesRes.data : [];
        const purchaseData = Array.isArray(purchaseRes?.data) ? purchaseRes.data : [];
        const incomeData = Array.isArray(incomeRes?.data) ? incomeRes.data : [];
        const expenseData = Array.isArray(expenseRes?.data) ? expenseRes.data : [];
        const damageData = Array.isArray(damageRes?.data?.data) ? damageRes.data.data : [];
        const stockMovementData = Array.isArray(stockMovementRes?.data?.data) ? stockMovementRes.data.data : [];

        // Sales Metrics
        const totalSales = salesData.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
        const totalOrders = salesData.reduce((acc, curr) => acc + (curr.totalOrders || 0), 0);
        
        // Inventory Metrics
        const totalValue = stockData.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);
        const totalItems = stockData.length;

        // Purchase Metrics
        const totalPurchases = purchaseData.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
        const totalPurchaseOrders = purchaseData.length;

        // Finance Metrics
        const totalIncome = incomeData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const totalExpense = expenseData.reduce((acc, curr) => acc + (curr.amount || 0), 0);
        const netProfit = totalIncome - totalExpense;

        // Damage Metrics
        const totalLoss = damageData.reduce((acc, curr) => acc + (curr.totalValue || 0), 0);
        const totalIncidents = damageData.length;

        // Stock Movement Metrics
        const totalMovements = stockMovementData.length;
        const inStock = stockMovementData.filter(t => t.transactionType === 'Stock In' || t.transactionType === 'Opening Stock').reduce((acc, curr) => acc + (curr.quantity || 0), 0);
        const outStock = stockMovementData.filter(t => t.transactionType === 'Stock Out').reduce((acc, curr) => acc + (curr.quantity || 0), 0);

        setReportsData(prevData => {
            const newData = [...prevData];
            const currentDate = new Date();
            const periodString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            const generatedDateString = currentDate.toISOString().split('T')[0];
            
            const salesReportIndex = newData.findIndex(r => r.reportType === 'Sales');
            if (salesReportIndex !== -1) {
                newData[salesReportIndex] = {
                    ...newData[salesReportIndex],
                    totalSales: totalSales,
                    totalOrders: totalOrders,
                    averageOrderValue: totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }
            
            const inventoryReportIndex = newData.findIndex(r => r.reportType === 'Inventory');
            if (inventoryReportIndex !== -1) {
                newData[inventoryReportIndex] = {
                    ...newData[inventoryReportIndex],
                    totalValue: totalValue,
                    totalItems: totalItems,
                    averageValue: totalItems > 0 ? Math.round(totalValue / totalItems) : 0,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }

            const purchaseReportIndex = newData.findIndex(r => r.reportType === 'Purchase');
            if (purchaseReportIndex !== -1) {
                newData[purchaseReportIndex] = {
                    ...newData[purchaseReportIndex],
                    totalPurchases: totalPurchases,
                    totalOrders: totalPurchaseOrders,
                    averageOrderValue: totalPurchaseOrders > 0 ? Math.round(totalPurchases / totalPurchaseOrders) : 0,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }

            const financeReportIndex = newData.findIndex(r => r.reportType === 'Finance');
            if (financeReportIndex !== -1) {
                newData[financeReportIndex] = {
                    ...newData[financeReportIndex],
                    totalIncome: totalIncome,
                    totalExpense: totalExpense,
                    netProfit: netProfit,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }

            const damageReportIndex = newData.findIndex(r => r.reportType === 'Damage');
            if (damageReportIndex !== -1) {
                newData[damageReportIndex] = {
                    ...newData[damageReportIndex],
                    totalLoss: totalLoss,
                    totalIncidents: totalIncidents,
                    averageLoss: totalIncidents > 0 ? Math.round(totalLoss / totalIncidents) : 0,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }

            const stockIdx = newData.findIndex(r => r.reportType === 'Stock');
            if (stockIdx !== -1) {
                newData[stockIdx] = {
                    ...newData[stockIdx],
                    totalMovements: totalMovements,
                    inStock: inStock,
                    outStock: outStock,
                    period: periodString,
                    generatedDate: generatedDateString
                };
            }

            return newData;
        });
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportsData();
  }, []);

  const filteredReports = reportsData.filter(report =>
    report.reportName.toLowerCase().includes(search.toLowerCase()) ||
    report.reportType.toLowerCase().includes(search.toLowerCase()) ||
    report.status.toLowerCase().includes(search.toLowerCase())
  );

  const getReportTypeColor = (type) => {
    switch (type) {
      case "Sales":
        return "hrms-badge-success";
      case "Inventory":
        return "hrms-badge-primary";
      case "Purchase":
        return "hrms-badge-warning";
      case "Finance":
        return "hrms-badge-error";
      case "Damage":
        return "hrms-badge-error";
      case "Stock":
        return "hrms-badge-primary";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Generated":
        return "hrms-badge-success";
      case "Generating":
        return "hrms-badge-warning";
      case "Failed":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case "Sales":
        return <TrendingUpOutlined />;
      case "Inventory":
        return <InventoryOutlined />;
      case "Purchase":
        return <AssessmentOutlined />;
      case "Finance":
        return <AttachMoneyOutlined />;
      case "Damage":
        return <AssessmentOutlined />;
      case "Stock":
        return <InventoryOutlined />;
      default:
        return <AssessmentOutlined />;
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
      
      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ marginBottom: "2rem" }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Box sx={{ color: "#2e7d32", fontSize: "2rem" }}>
                  <TrendingUpOutlined />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ₹{reportsData.find(r => r.reportType === 'Sales')?.totalSales?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Sales
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Box sx={{ color: "#1976d2", fontSize: "2rem" }}>
                  <InventoryOutlined />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ₹{reportsData.find(r => r.reportType === 'Inventory')?.totalValue?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inventory Value
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Box sx={{ color: "#d32f2f", fontSize: "2rem" }}>
                  <AttachMoneyOutlined />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ₹{reportsData.find(r => r.reportType === 'Damage')?.totalLoss?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Loss
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <Box sx={{ color: "#ed6c02", fontSize: "2rem" }}>
                  <AssessmentOutlined />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {reportsData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Reports Generated
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search reports..."
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
      </Box>

      {/* Reports Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Report Id</TableCell>
                <TableCell>Report Name</TableCell>
                <TableCell>Report Type</TableCell>
                <TableCell>Period</TableCell>
                <TableCell>Generated Date</TableCell>
                <TableCell>Generated By</TableCell>
                <TableCell>Key Metrics</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>File Size</TableCell>
                <TableCell>Format</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((report, index) => (
                  <TableRow key={report.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {report.reportId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Box sx={{ color: "#666" }}>
                          {getReportIcon(report.reportType)}
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {report.reportName}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getReportTypeColor(report.reportType)}`}>
                        {report.reportType}
                      </Box>
                    </TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>{report.generatedDate}</TableCell>
                    <TableCell>{report.generatedBy}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {report.reportType === "Sales" && `Sales: ₹${report.totalSales?.toLocaleString()}, Orders: ${report.totalOrders}`}
                        {report.reportType === "Inventory" && `Value: ₹${report.totalValue?.toLocaleString()}, Items: ${report.totalItems}`}
                        {report.reportType === "Purchase" && `Purchases: ₹${report.totalPurchases?.toLocaleString()}, Orders: ${report.totalOrders}`}
                        {report.reportType === "Finance" && `Income: ₹${report.totalIncome?.toLocaleString()}, Expense: ₹${report.totalExpense?.toLocaleString()}`}
                        {report.reportType === "Damage" && `Loss: ₹${report.totalLoss?.toLocaleString()}, Incidents: ${report.totalIncidents}`}
                        {report.reportType === "Stock" && `Movements: ${report.totalMovements}, In: ${report.inStock}, Out: ${report.outStock}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(report.status)}`}>
                        {report.status}
                      </Box>
                    </TableCell>
                    <TableCell>{report.fileSize}</TableCell>
                    <TableCell>{report.format}</TableCell>
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
                          sx={{ color: "#2e7d32", fontSize: "16px" }}
                        >
                          <DownloadOutlined />
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredReports.length)} of {filteredReports.length} reports
            </Typography>
            <Pagination
              count={Math.ceil(filteredReports.length / rowsPerPage)}
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

export default Reports;
