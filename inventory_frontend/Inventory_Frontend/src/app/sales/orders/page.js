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
import CreateSalesOrder from "@/components/sales/sales-order/Create";
import ViewSalesOrder from "@/components/sales/sales-order/View";
import EditSalesOrder from "@/components/sales/sales-order/Edit";
import DeleteSalesOrder from "@/components/sales/sales-order/Delete";
import { getAllSalesOrders, createSalesOrder, updateSalesOrder, deleteSalesOrder } from "@/lib/salesApi";

const SalesOrders = () => {
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

  // Sales Orders data - fetched from API
  const [salesData, setSalesData] = useState([]);

  // Fetch sales orders on mount
  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSalesOrders();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setSalesData(fetchedData);
    } catch (err) {
      console.error('Error fetching sales orders:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch sales orders');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (row) => { 
    setDeleteData(row);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { 
    setViewShow(false); 
    setEditShow(false); 
    setDeleteShow(false); 
    setCreateShow(false);
    setViewData(null);
    setEditData(null);
    setDeleteData(null);
  };

  const handleCreate = async (newOrder) => {
    try {
      setLoading(true);
      await createSalesOrder(newOrder);
      await fetchSalesData();
      setCreateShow(false);
      setError(null);
    } catch (err) {
      console.error('Error creating sales order:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedOrder) => {
    try {
      setLoading(true);
      const orderId = editData?._id || editData?.id;
      await updateSalesOrder(orderId, updatedOrder);
      await fetchSalesData();
      setEditShow(false);
      setEditData(null);
      setError(null);
    } catch (err) {
      console.error('Error updating sales order:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update sales order');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const orderId = deleteData?._id || deleteData?.id;
      await deleteSalesOrder(orderId);
      await fetchSalesData();
      setDeleteShow(false);
      setDeleteData(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting sales order:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete sales order');
    } finally {
      setLoading(false);
    }
  };

  // Filter data - handle both old format and new backend format
  const filteredData = salesData.filter(row => {
    const orderId = row.salesOrderId || row.orderNumber || row.orderId || '';
    const customerName = row.customerName || '';
    const productName = row.productName || (row.items && row.items[0]?.itemName) || '';
    return orderId.toLowerCase().includes(search.toLowerCase()) ||
           customerName.toLowerCase().includes(search.toLowerCase()) ||
           productName.toLowerCase().includes(search.toLowerCase());
  });

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status || 'Pending';
    switch (normalizedStatus) {
      case "Delivered":
      case "Confirmed":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Processing":
      case "Shipped":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Cancelled":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  // Loading state
  if (loading && salesData.length === 0) {
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
          disabled={loading}
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
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No sales orders found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((row, index) => {
                const orderId = row.salesOrderId || row.orderNumber || row.orderId || 'N/A';
                const customerName = row.customerName || 'N/A';
                const productName = row.productName || (row.items && row.items[0]?.itemName) || 'N/A';
                const quantity = row.quantity || (row.items && row.items[0]?.quantity) || 0;
                const totalAmount = row.totalAmount || 0;
                const orderDate = row.orderDate ? new Date(row.orderDate).toLocaleDateString() : 'N/A';
                const status = row.orderStatus || row.status || 'Pending';
                const rowId = row._id || row.id || index;
                
                return (
                  <TableRow key={rowId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {orderId}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customerName}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {productName}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {quantity}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">₹{Number(totalAmount).toLocaleString()}</TableCell>
                    <TableCell align="left">{orderDate}</TableCell>
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
                          onClick={() => handleShowDelete(row)}
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
        <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2 }}>
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