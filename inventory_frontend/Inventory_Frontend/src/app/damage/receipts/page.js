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
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined, Download as DownloadIcon } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateReceipt from "@/components/damage-tracking/Receipts/Create";
import ViewReceipt from "@/components/damage-tracking/Receipts/View";
import EditReceipt from "@/components/damage-tracking/Receipts/Edit";
import DeleteReceipt from "@/components/damage-tracking/Receipts/Delete";
import { fetchDamageReceipts, createDamageReceipt, updateDamageReceipt, deleteDamageReceipt } from '../../../lib/damageApi';

const AttachReceipts = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  // Dialog states
  const [createShow, setCreateShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Real data from API
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Fetch damage receipts from API
  const loadReceiptData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchDamageReceipts(page + 1, rowsPerPage);
      setReceiptData(response.data || []);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
    } catch (err) {
      setError(err.message || "Failed to fetch damage receipts");
      console.error("Error fetching damage receipts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceiptData();
  }, [page]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = receiptData.find(row => row.id === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newReceipt) => {
    try {
      await createDamageReceipt(newReceipt);
      setCreateShow(false);
      loadReceiptData();
    } catch (err) {
      console.error("Error creating receipt:", err);
      alert(err.message || "Failed to create receipt");
    }
  };

  const handleUpdate = async (updatedReceipt) => {
    try {
      await updateDamageReceipt(updatedReceipt.id, updatedReceipt);
      setEditShow(false);
      setEditData(null);
      loadReceiptData();
    } catch (err) {
      console.error("Error updating receipt:", err);
      alert(err.message || "Failed to update receipt");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDamageReceipt(deleteId);
      setDeleteShow(false);
      setDeleteData(null);
      setDeleteId(null);
      loadReceiptData();
    } catch (err) {
      console.error("Error deleting receipt:", err);
      alert(err.message || "Failed to delete receipt");
    }
  };

  const handleDownload = (row) => {
    // Create a genuine PDF receipt
    const receiptData = {
      receiptNumber: row.receiptNumber || `RCP-${row.id}`,
      productName: row.productName,
      receiptDate: row.receiptDate,
      amount: row.totalValue,
      supplier: row.damageId?.damageType || 'N/A',
      status: row.status,
      warehouse: row.warehouse
    };
    
    // Create HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Receipt - ${receiptData.receiptNumber}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .receipt-container {
                max-width: 400px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #1976d2, #1565c0);
                color: white;
                padding: 20px;
                text-align: center;
            }
            .company-name {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .company-tagline {
                font-size: 12px;
                opacity: 0.9;
            }
            .receipt-title {
                background: #f8f9fa;
                padding: 15px 20px;
                text-align: center;
                border-bottom: 2px solid #e9ecef;
            }
            .receipt-title h2 {
                margin: 0;
                color: #333;
                font-size: 18px;
            }
            .receipt-details {
                padding: 20px;
            }
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                padding: 8px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .detail-row:last-child {
                border-bottom: none;
                font-weight: bold;
                background: #f8f9fa;
                margin: 15px -20px -20px -20px;
                padding: 15px 20px;
                border-top: 2px solid #e9ecef;
            }
            .detail-label {
                color: #666;
                font-weight: 500;
            }
            .detail-value {
                color: #333;
                font-weight: 600;
            }
            .amount {
                color: #1976d2;
                font-size: 18px;
            }
            .status {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-verified {
                background: #e8f5e8;
                color: #2e7d32;
            }
            .status-pending {
                background: #fff3e0;
                color: #f57c00;
            }
            .status-rejected {
                background: #ffebee;
                color: #d32f2f;
            }
            .footer {
                background: #f8f9fa;
                padding: 15px 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
                border-top: 1px solid #e9ecef;
            }
            .receipt-number {
                font-size: 14px;
                color: #1976d2;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <div class="header">
                <div class="company-name">VENTURING DIGITALLY</div>
                <div class="company-tagline">Inventory Management System</div>
            </div>
            
            <div class="receipt-title">
                <h2>DAMAGE RECEIPT</h2>
            </div>
            
            <div class="receipt-details">
                <div class="detail-row">
                    <span class="detail-label">Receipt Number:</span>
                    <span class="detail-value receipt-number">${receiptData.receiptNumber}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Product Name:</span>
                    <span class="detail-value">${receiptData.productName}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Receipt Date:</span>
                    <span class="detail-value">${new Date(receiptData.receiptDate).toLocaleDateString('en-IN')}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Supplier:</span>
                    <span class="detail-value">${receiptData.supplier}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Warehouse:</span>
                    <span class="detail-value">${receiptData.warehouse}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status status-${receiptData.status.toLowerCase()}">${receiptData.status}</span>
                    </span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value amount">₹${receiptData.amount.toLocaleString()}</span>
                </div>
            </div>
            
            <div class="footer">
                <div>Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}</div>
                <div style="margin-top: 5px;">This is a computer generated receipt</div>
            </div>
        </div>
    </body>
    </html>
    `;
    
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load then trigger print
    printWindow.onload = function() {
        setTimeout(() => {
            printWindow.print();
            // Close the window after printing
            setTimeout(() => {
                printWindow.close();
            }, 1000);
        }, 500);
    };
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  // Filter data
  const filteredData = receiptData.filter(row =>
    row.productName?.toLowerCase().includes(search.toLowerCase()) ||
    row.receiptNumber?.toLowerCase().includes(search.toLowerCase()) ||
    row.receivedBy?.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Submitted":
      case "Under Review":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Draft":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search receipts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOpen}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            transform: 'none',
            textTransform: 'none'
          }}
        >
          Attach Receipt
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Table */}
          <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Receipt Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Receipt Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Received By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.map((row, index) => (
                  <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.receiptNumber}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">{row.productName}</TableCell>
                    <TableCell align="left">{row.receiptDate}</TableCell>
                    <TableCell align="left">₹{row.totalValue?.toLocaleString()}</TableCell>
                    <TableCell align="left">{row.receivedBy}</TableCell>
                    <TableCell align="left">{row.warehouseName}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          ...getStatusColor(row.status),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleView(row)}
                          sx={{ color: '#1976d2' }}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{ color: '#000' }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(row)}
                          sx={{ color: '#4caf50' }}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleShowDelete(row.id)}
                          sx={{ color: '#f44336' }}
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

          {/* Pagination */}
          <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} receipts
              </Typography>
              <Pagination
                count={pagination.totalPages}
                page={page + 1}
                onChange={(_, newPage) => setPage(newPage - 1)}
                color="primary"
                size="small"
              />
            </Stack>
          </Box>
        </>
      )}

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Attach New Receipt" :
          viewShow ? "View Receipt" :
          editShow ? "Edit Receipt" :
          deleteShow ? "Delete Receipt" : ""
        }
        dialogContent={
          createShow ? <CreateReceipt handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewReceipt viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditReceipt editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteReceipt receiptData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default AttachReceipts;
