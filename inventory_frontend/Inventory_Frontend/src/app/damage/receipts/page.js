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
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined, Download as DownloadIcon } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateReceipt from "@/components/Damage Tracking/Receipts/Create";
import ViewReceipt from "@/components/Damage Tracking/Receipts/View";
import EditReceipt from "@/components/Damage Tracking/Receipts/Edit";
import DeleteReceipt from "@/components/Damage Tracking/Receipts/Delete";

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

  // Receipt data - simplified
  const [receiptData, setReceiptData] = useState([
    {
      id: "RCP001",
      receiptId: "RCP001",
      damageId: "DMG001",
      productName: "Samsung Galaxy S24",
      receiptNumber: "RCP-2024-001",
      receiptDate: "2024-09-18",
      amount: 84000,
      supplier: "Samsung India",
      status: "Verified",
      warehouse: "Main Warehouse"
    },
    {
      id: "RCP002",
      receiptId: "RCP002",
      damageId: "DMG002",
      productName: "Office Chair",
      receiptNumber: "RCP-2024-002",
      receiptDate: "2024-09-15",
      amount: 10000,
      supplier: "Furniture World",
      status: "Pending",
      warehouse: "North Warehouse"
    },
    {
      id: "RCP003",
      receiptId: "RCP003",
      damageId: "DMG003",
      productName: "Coffee Mug",
      receiptNumber: "RCP-2024-003",
      receiptDate: "2024-09-20",
      amount: 2500,
      supplier: "Kitchen Supplies",
      status: "Verified",
      warehouse: "South Warehouse"
    }
  ]);

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

  const handleCreate = (newReceipt) => {
    const nextId = receiptData.length + 1;
    const newReceiptData = {
      ...newReceipt,
      id: `RCP${String(nextId).padStart(3, '0')}`
    };
    setReceiptData([...receiptData, newReceiptData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedReceipt) => {
    setReceiptData(receiptData.map(row => 
      row.id === updatedReceipt.id 
        ? { ...updatedReceipt }
        : row
    ));
  };

  const handleDelete = () => {
    setReceiptData(receiptData.filter(row => row.id !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  const handleDownload = (row) => {
    // Create a genuine PDF receipt
    const receiptData = {
      receiptNumber: row.receiptNumber || `RCP-${row.id}`,
      productName: row.productName,
      receiptDate: row.receiptDate,
      amount: row.amount,
      supplier: row.supplier,
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

  // Filter data
  const filteredData = receiptData.filter(row =>
    row.productName.toLowerCase().includes(search.toLowerCase()) ||
    row.supplier.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
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

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier</TableCell>
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
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.receiptDate}</TableCell>
                <TableCell align="left">₹{row.amount.toLocaleString()}</TableCell>
                <TableCell align="left">{row.supplier}</TableCell>
                <TableCell align="left">{row.warehouse}</TableCell>
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
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            size="small"
          />
        </Stack>
      </Box>

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
