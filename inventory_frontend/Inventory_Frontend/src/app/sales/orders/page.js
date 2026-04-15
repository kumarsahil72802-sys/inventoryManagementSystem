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
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateSalesOrder from "@/components/sales/sales-order/Create";
import ViewSalesOrder from "@/components/sales/sales-order/View";
import EditSalesOrder from "@/components/sales/sales-order/Edit";
import DeleteSalesOrder from "@/components/sales/sales-order/Delete";

const SalesOrders = () => {
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

  // Sales Orders data - simplified
  const [salesData, setSalesData] = useState([
    {
      id: "SO001",
      orderId: "SO001",
      customerName: "ABC Electronics",
      productName: "Samsung Galaxy S24",
      quantity: 4,
      totalAmount: 180000,
      orderDate: "2024-09-18",
      status: "Processing"
    },
    {
      id: "SO002",
      orderId: "SO002",
      customerName: "XYZ Furniture",
      productName: "Office Chair",
      quantity: 10,
      totalAmount: 50000,
      orderDate: "2024-09-19",
      status: "Delivered"
    },
    {
      id: "SO003",
      orderId: "SO003",
      customerName: "Tech Solutions",
      productName: "LED TV 43",
      quantity: 2,
      totalAmount: 80000,
      orderDate: "2024-09-20",
      status: "Pending"
    }
  ]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = salesData.find(row => row.orderId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newOrder) => {
    const nextId = salesData.length + 1;
    const newOrderData = {
      ...newOrder,
      id: `SO${String(nextId).padStart(3, '0')}`,
      orderId: `SO${String(nextId).padStart(3, '0')}`
    };
    setSalesData([...salesData, newOrderData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedOrder) => {
    setSalesData(salesData.map(row => 
      row.orderId === updatedOrder.orderId 
        ? { ...updatedOrder }
        : row
    ));
  };

  const handleDelete = () => {
    setSalesData(salesData.filter(row => row.orderId !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  // Filter data
  const filteredData = salesData.filter(row =>
    row.orderId.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Processing":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search sales orders..."
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
          Add Sales Order
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order Date</TableCell>
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
                    {row.orderId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.customerName}
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
                <TableCell align="left">₹{row.totalAmount.toLocaleString()}</TableCell>
                <TableCell align="left">{row.orderDate}</TableCell>
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
                      onClick={() => handleShowDelete(row.orderId)}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} sales orders
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

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Sales Order" :
          viewShow ? "View Sales Order" :
          editShow ? "Edit Sales Order" :
          deleteShow ? "Delete Sales Order" : ""
        }
        dialogContent={
          createShow ? <CreateSalesOrder handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewSalesOrder viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditSalesOrder editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteSalesOrder orderData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default SalesOrders;