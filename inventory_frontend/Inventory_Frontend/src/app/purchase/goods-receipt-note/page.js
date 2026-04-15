"use client";
import React, { useState } from "react";
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
  Button,
  Grid,
  Chip,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import CommonDialog from "@/components/CommonDialog";
import CreateGoodsReceiptNote from "@/components/Purchase Management/Goods Reciept Note/Create";
import ViewGoodsReceiptNote from "@/components/Purchase Management/Goods Reciept Note/View";
import EditGoodsReceiptNote from "@/components/Purchase Management/Goods Reciept Note/Edit";
import DeleteGoodsReceiptNote from "@/components/Purchase Management/Goods Reciept Note/Delete";

export default function GoodsReceiptNoteTable() {
  const [rows, setRows] = useState([
    createData(1, "GRN001", "2024-01-15", "ABC Suppliers", "Laptop Pro 15", 5, 250000, "Received"),
    createData(2, "GRN002", "2024-01-16", "XYZ Electronics", "Office Chair", 10, 30000, "Pending"),
    createData(3, "GRN003", "2024-01-17", "Tech Solutions", "LED TV 43", 3, 66000, "Verified"),
  ]);

  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  function createData(si, receiptId, receiptDate, supplierName, productName, quantity, totalAmount, status) {
    return {
      si, receiptId, receiptDate, supplierName, productName, quantity, totalAmount, status,
      action: null
    };
  }

  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = rows.find(row => row.receiptId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newReceipt) => {
    const nextSi = rows.length + 1;
    const newReceiptData = {
      ...newReceipt,
      si: nextSi,
      receiptId: `GRN${String(nextSi).padStart(3, '0')}`,
      action: null
    };
    setRows([...rows, newReceiptData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedReceipt) => {
    setRows(rows.map(row => 
      row.receiptId === updatedReceipt.receiptId 
        ? { ...updatedReceipt, action: null }
        : row
    ));
  };

  const handleDelete = () => {
    setRows(rows.filter(row => row.receiptId !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  const filteredRows = rows.filter(row =>
    row.receiptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentPageData = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  return (
    <div className="content-area">
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search goods receipt notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateOpen}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            transform: 'none',
            textTransform: 'none'
          }}
        >
          Add Goods Receipt Note
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Supplier Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Receipt Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row) => (
              <TableRow key={row.si} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{row.si}</TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.receiptId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.supplierName}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.receiptDate}</TableCell>
                <TableCell align="left">₹{row.totalAmount.toLocaleString()}</TableCell>
                <TableCell align="left">
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      backgroundColor: row.status === "Received" ? "#e8f5e8" : 
                                     row.status === "Verified" ? "#e3f2fd" : "#fff3e0",
                      color: row.status === "Received" ? "#2e7d32" : 
                            row.status === "Verified" ? "#1976d2" : "#f57c00",
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
                      onClick={() => handleShowDelete(row.receiptId)}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} goods receipt notes
          </Typography>
          <Pagination
            count={Math.ceil(filteredRows.length / rowsPerPage)}
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
          createShow ? "Create New Goods Receipt Note" :
          viewShow ? "View Goods Receipt Note" :
          editShow ? "Edit Goods Receipt Note" :
          deleteShow ? "Delete Goods Receipt Note" : ""
        }
        dialogContent={
          createShow ? <CreateGoodsReceiptNote handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewGoodsReceiptNote viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditGoodsReceiptNote editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteGoodsReceiptNote receiptData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
}
