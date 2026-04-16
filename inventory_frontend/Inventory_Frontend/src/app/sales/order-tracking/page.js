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
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateOrderTracking from "@/components/sales/order-tracking/Create";
import ViewOrderTracking from "@/components/sales/order-tracking/View";
import EditOrderTracking from "@/components/sales/order-tracking/Edit";
import DeleteOrderTracking from "@/components/sales/order-tracking/Delete";
import { getAllOrderTracking, createOrderTracking, updateOrderTracking, deleteOrderTracking } from "@/lib/salesApi";

const OrderTracking = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialog states
  const [createShow, setCreateShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Order Tracking data - fetched from API
  const [trackingData, setTrackingData] = useState([]);

  // Fetch order tracking on mount
  useEffect(() => {
    fetchOrderTracking();
  }, []);

  const fetchOrderTracking = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllOrderTracking();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setTrackingData(fetchedData);
    } catch (err) {
      console.error('Error fetching order tracking:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch order tracking');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = trackingData.find(row => row.trackingNumber === id || row._id === id || row.id === id);
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newTracking) => {
    try {
      setLoading(true);
      await createOrderTracking(newTracking);
      await fetchOrderTracking();
      setCreateShow(false);
      setError(null);
    } catch (err) {
      console.error('Error creating order tracking:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create order tracking');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedTracking) => {
    try {
      setLoading(true);
      const trackingId = editData?._id || editData?.id;
      await updateOrderTracking(trackingId, updatedTracking);
      await fetchOrderTracking();
      setEditShow(false);
      setEditData(null);
      setError(null);
    } catch (err) {
      console.error('Error updating order tracking:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update order tracking');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const trackingId = deleteData?._id || deleteData?.id;
      await deleteOrderTracking(trackingId);
      await fetchOrderTracking();
      setDeleteShow(false);
      setDeleteData(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting order tracking:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete order tracking');
    } finally {
      setLoading(false);
    }
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

  // Loading state
  if (loading && trackingData.length === 0) {
    return (
      <div className="content-area">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No order tracking records found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((row, index) => {
                const trackingNum = row.trackingNumber || row.trackingId || 'N/A';
                const orderNum = row.orderNumber || row.orderId || 'N/A';
                const customerName = row.customerId?.name || row.customerId?.customerName || row.customerName || 'N/A';
                const orderDate = row.orderId?.orderDate ? new Date(row.orderId.orderDate).toLocaleDateString() : 
                                 (row.orderDate ? new Date(row.orderDate).toLocaleDateString() : 'N/A');
                const status = row.status || row.currentStatus || 'Pending';
                const estDelivery = row.estimatedDelivery ? new Date(row.estimatedDelivery).toLocaleDateString() : 'N/A';
                const rowId = row._id || row.id || index;
                
                return (
                  <TableRow key={rowId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {trackingNum}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {orderNum}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {orderDate}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customerName}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        See Details
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          ...getStatusColor(status),
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell align="left">{estDelivery}</TableCell>
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
                          onClick={() => handleShowDelete(row._id || row.id)}
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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