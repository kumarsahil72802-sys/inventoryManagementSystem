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
import CreateOrderTracking from "@/components/sales/order-tracking/Create";
import ViewOrderTracking from "@/components/sales/order-tracking/View";
import EditOrderTracking from "@/components/sales/order-tracking/Edit";
import DeleteOrderTracking from "@/components/sales/order-tracking/Delete";

const OrderTracking = () => {
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

  // Order Tracking data - simplified
  const [trackingData, setTrackingData] = useState([
    {
      id: "OT001",
      trackingId: "OT001",
      orderId: "SO001",
      orderDate: "2024-09-20",
      customerName: "ABC Electronics",
      productName: "Samsung Galaxy S24",
      currentStatus: "In Transit",
      warehouse: "Main Warehouse",
      estimatedDelivery: "2024-09-25",
      status: "Active"
    },
    {
      id: "OT002",
      trackingId: "OT002",
      orderId: "SO002",
      orderDate: "2024-09-18",
      customerName: "XYZ Furniture",
      productName: "Office Chair",
      currentStatus: "Delivered",
      warehouse: "North Warehouse",
      estimatedDelivery: "2024-09-22",
      status: "Completed"
    },
    {
      id: "OT003",
      trackingId: "OT003",
      orderId: "SO003",
      orderDate: "2024-09-22",
      customerName: "Tech Solutions",
      productName: "LED TV 43",
      currentStatus: "Processing",
      warehouse: "South Warehouse",
      estimatedDelivery: "2024-09-28",
      status: "Active"
    }
  ]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = trackingData.find(row => row.trackingId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newTracking) => {
    const nextId = trackingData.length + 1;
    const newTrackingData = {
      ...newTracking,
      id: `OT${String(nextId).padStart(3, '0')}`,
      trackingId: `OT${String(nextId).padStart(3, '0')}`
    };
    setTrackingData([...trackingData, newTrackingData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedTracking) => {
    setTrackingData(trackingData.map(row => 
      row.trackingId === updatedTracking.trackingId 
        ? { ...updatedTracking }
        : row
    ));
  };

  const handleDelete = () => {
    setTrackingData(trackingData.filter(row => row.trackingId !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  // Filter data
  const filteredData = trackingData.filter(row =>
    row.trackingId.toLowerCase().includes(search.toLowerCase()) ||
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
      case "In Transit":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Processing":
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
          placeholder="Search order tracking..."
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
          Add Order Tracking
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tracking ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Current Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estimated Delivery</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.trackingId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.orderId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.orderDate}
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
                  <Chip
                    label={row.currentStatus}
                    size="small"
                    sx={{
                      ...getStatusColor(row.currentStatus),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="left">{row.estimatedDelivery}</TableCell>
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
                      onClick={() => handleShowDelete(row.trackingId)}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} order tracking records
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
          createShow ? "Create New Order Tracking" :
          viewShow ? "View Order Tracking" :
          editShow ? "Edit Order Tracking" :
          deleteShow ? "Delete Order Tracking" : ""
        }
        dialogContent={
          createShow ? <CreateOrderTracking handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewOrderTracking viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditOrderTracking editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteOrderTracking trackingData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default OrderTracking;