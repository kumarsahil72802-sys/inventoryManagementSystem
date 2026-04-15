"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  InputAdornment,
  Pagination,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined, Download as DownloadIcon } from "@mui/icons-material";
import CommonDialog from "../../components/CommonDialog";
import CreateInvoice from "../../components/Invoice/Create";
import ViewInvoice from "../../components/Invoice/View";
import EditInvoice from "../../components/Invoice/Edit";
import DeleteInvoice from "../../components/Invoice/Delete";
import { getAllInvoices, createInvoice, updateInvoice, deleteInvoice } from '../../lib/invoiceApi';

export default function InvoicePage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch invoices on component mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await getAllInvoices();
        // Ensure data is an array
        const fetchedData = Array.isArray(response?.data) ? response.data :
                           (Array.isArray(response) ? response : []);
        setInvoiceData(fetchedData);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch invoices');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = invoiceData.find(row => row.id === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newInvoice) => {
    try {
      await createInvoice(newInvoice);

      // Refresh the invoices list
      const response = await getAllInvoices();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setInvoiceData(fetchedData);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create invoice');
    }
  };

  const handleUpdate = async (updatedInvoice) => {
    try {
      await updateInvoice(updatedInvoice._id || updatedInvoice.id, updatedInvoice);

      // Refresh the invoices list
      const response = await getAllInvoices();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setInvoiceData(fetchedData);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update invoice');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(deleteData._id || deleteData.id);

      // Refresh the invoices list
      const response = await getAllInvoices();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setInvoiceData(fetchedData);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete invoice');
    }
  };

  const handleDownload = (row) => {
    // Create a professional invoice PDF
    const invoiceData = {
      invoiceNumber: row.invoiceNumber,
      customerName: row.customerName,
      customerEmail: row.customerEmail,
      customerPhone: row.customerPhone,
      billingAddress: row.billingAddress,
      supplierName: row.supplierName,
      supplierEmail: row.supplierEmail,
      supplierPhone: row.supplierPhone,
      supplierAddress: row.supplierAddress,
      invoiceDate: row.invoiceDate,
      dueDate: row.dueDate,
      items: row.items,
      subtotal: row.subtotal,
      taxRate: row.taxRate,
      taxAmount: row.taxAmount,
      totalAmount: row.totalAmount,
      status: row.status,
      paymentTerms: row.paymentTerms,
      notes: row.notes
    };
    
    // Create HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invoice - ${invoiceData.invoiceNumber}</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f5f5f5;
            }
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #1976d2, #1565c0);
                color: white;
                padding: 30px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .company-info h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
            }
            .company-info p {
                margin: 5px 0 0 0;
                font-size: 14px;
                opacity: 0.9;
            }
            .invoice-header {
                text-align: right;
            }
            .invoice-title {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .invoice-number {
                font-size: 16px;
                opacity: 0.9;
            }
            .addresses {
                display: flex;
                justify-content: space-between;
                padding: 30px;
                background: #f8f9fa;
                border-bottom: 2px solid #e9ecef;
            }
            .address-section {
                flex: 1;
                margin: 0 15px;
            }
            .address-section h3 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 16px;
                font-weight: bold;
                border-bottom: 2px solid #1976d2;
                padding-bottom: 5px;
            }
            .address-section p {
                margin: 5px 0;
                color: #666;
                line-height: 1.4;
            }
            .invoice-details {
                padding: 30px;
            }
            .details-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 10px 0;
                border-bottom: 1px solid #f0f0f0;
            }
            .details-row:last-child {
                border-bottom: none;
            }
            .detail-label {
                color: #666;
                font-weight: 500;
                min-width: 120px;
            }
            .detail-value {
                color: #333;
                font-weight: 600;
            }
            .items-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                background: white;
            }
            .items-table th {
                background: #1976d2;
                color: white;
                padding: 15px 10px;
                text-align: left;
                font-weight: bold;
            }
            .items-table td {
                padding: 12px 10px;
                border-bottom: 1px solid #e9ecef;
            }
            .items-table tr:nth-child(even) {
                background: #f8f9fa;
            }
            .text-right {
                text-align: right;
            }
            .totals {
                margin-top: 20px;
                display: flex;
                justify-content: flex-end;
            }
            .totals-table {
                width: 300px;
                border-collapse: collapse;
            }
            .totals-table td {
                padding: 8px 15px;
                border-bottom: 1px solid #e9ecef;
            }
            .totals-table .total-row {
                background: #1976d2;
                color: white;
                font-weight: bold;
                font-size: 16px;
            }
            .status {
                display: inline-block;
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .status-paid {
                background: #e8f5e8;
                color: #2e7d32;
            }
            .status-pending {
                background: #fff3e0;
                color: #f57c00;
            }
            .status-overdue {
                background: #ffebee;
                color: #d32f2f;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px 30px;
                border-top: 2px solid #e9ecef;
            }
            .footer p {
                margin: 5px 0;
                color: #666;
                font-size: 12px;
            }
            .notes {
                background: #fff3e0;
                padding: 15px;
                border-left: 4px solid #f57c00;
                margin: 20px 0;
            }
            .notes h4 {
                margin: 0 0 10px 0;
                color: #f57c00;
                font-size: 14px;
            }
            .notes p {
                margin: 0;
                color: #666;
                font-style: italic;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <div class="header">
                <div class="company-info">
                    <h1>VENTURING DIGITALLY</h1>
                    <p>Inventory Management System</p>
                    <p>GST: 27ABCDE1234F1Z5</p>
                </div>
                <div class="invoice-header">
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-number">${invoiceData.invoiceNumber}</div>
                </div>
            </div>
            
            <div class="addresses">
                <div class="address-section">
                    <h3>Bill To:</h3>
                    <p><strong>${invoiceData.customerName}</strong></p>
                    <p>${invoiceData.customerEmail}</p>
                    <p>${invoiceData.customerPhone}</p>
                    <p>${invoiceData.billingAddress}</p>
                </div>
                <div class="address-section">
                    <h3>From:</h3>
                    <p><strong>${invoiceData.supplierName}</strong></p>
                    <p>${invoiceData.supplierEmail}</p>
                    <p>${invoiceData.supplierPhone}</p>
                    <p>${invoiceData.supplierAddress}</p>
                </div>
      </div>
      
            <div class="invoice-details">
                <div class="details-row">
                    <span class="detail-label">Invoice Date:</span>
                    <span class="detail-value">${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="details-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value">${new Date(invoiceData.dueDate).toLocaleDateString('en-IN')}</span>
                </div>
                <div class="details-row">
                    <span class="detail-label">Payment Terms:</span>
                    <span class="detail-value">${invoiceData.paymentTerms}</span>
        </div>
                <div class="details-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status status-${invoiceData.status.toLowerCase()}">${invoiceData.status}</span>
                    </span>
        </div>
      </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th class="text-right">Quantity</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoiceData.items.map(item => `
                        <tr>
                            <td>${item.productName}</td>
                            <td class="text-right">${item.quantity}</td>
                            <td class="text-right">₹${item.unitPrice.toLocaleString()}</td>
                            <td class="text-right">₹${item.total.toLocaleString()}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="totals">
                <table class="totals-table">
                    <tr>
                        <td>Subtotal:</td>
                        <td class="text-right">₹${invoiceData.subtotal.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>GST (${invoiceData.taxRate}%):</td>
                        <td class="text-right">₹${invoiceData.taxAmount.toLocaleString()}</td>
                    </tr>
                    <tr class="total-row">
                        <td>Total Amount:</td>
                        <td class="text-right">₹${invoiceData.totalAmount.toLocaleString()}</td>
                    </tr>
                </table>
            </div>
            
            ${invoiceData.notes ? `
            <div class="notes">
                <h4>Notes:</h4>
                <p>${invoiceData.notes}</p>
            </div>
            ` : ''}
            
            <div class="footer">
                <p><strong>Payment Information:</strong></p>
                <p>Bank: State Bank of India | Account: 1234567890 | IFSC: SBIN0001234</p>
                <p>Generated on: ${new Date().toLocaleDateString('en-IN')} at ${new Date().toLocaleTimeString('en-IN')}</p>
                <p>This is a computer generated invoice</p>
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
  const filteredData = invoiceData.filter(row =>
    row.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.supplierName.toLowerCase().includes(search.toLowerCase()) ||
    row.status.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Overdue":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
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
    <Box sx={{ p: 3 }}>
      {/* Header */}


        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent:"flex-end", mb: 3 }}>
          <TextField
            placeholder="Search invoices..."
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
            Add Invoice
          </Button>
        </Box>
    

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Invoice Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.invoiceNumber}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.customerName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.supplierName}
                  </Typography>
                </TableCell>
                <TableCell align="left">{new Date(row.invoiceDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell align="left">{new Date(row.dueDate).toLocaleDateString('en-IN')}</TableCell>
                <TableCell align="left">₹{row.totalAmount.toLocaleString()}</TableCell>
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
     
      {/* Pagination */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} invoices
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
      </Box>

      {/* Dialogs */}
      <CommonDialog
        open={viewShow}
        onClose={handleClose}
        title="Invoice Details"
        content={<ViewInvoice viewData={viewData} handleClose={handleClose} />}
        maxWidth="md"
        fullWidth
      />

      <CommonDialog
        open={editShow}
        onClose={handleClose}
        title="Edit Invoice"
        content={<EditInvoice editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} />}
        maxWidth="lg"
        fullWidth
      />

      <CommonDialog
        open={deleteShow}
        onClose={handleClose}
        title="Delete Invoice"
        content={<DeleteInvoice deleteData={deleteData} handleDelete={handleDelete} handleClose={handleClose} />}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
      />

      <CommonDialog
        open={createShow}
        onClose={handleClose}
        title="Add Invoice"
        content={<CreateInvoice handleClose={handleClose} handleCreate={handleCreate} />}
        maxWidth="lg"
        fullWidth
      />
    </Box>
  );
}
