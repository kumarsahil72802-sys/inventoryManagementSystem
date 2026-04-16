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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateDeliveryChallan from "@/components/sales/delivery-challan/Create";
import ViewDeliveryChallan from "@/components/sales/delivery-challan/View";
import EditDeliveryChallan from "@/components/sales/delivery-challan/Edit";
import DeleteDeliveryChallan from "@/components/sales/delivery-challan/Delete";
import { getAllDeliveryChallans, createDeliveryChallan, updateDeliveryChallan, deleteDeliveryChallan } from "@/lib/salesApi";

const DeliveryChallans = () => {
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

  // Delivery Challans data - fetched from API
  const [challanData, setChallanData] = useState([]);

  // Fetch delivery challans on mount
  useEffect(() => {
    fetchDeliveryChallans();
  }, []);

  const fetchDeliveryChallans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllDeliveryChallans();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setChallanData(fetchedData);
    } catch (err) {
      console.error('Error fetching delivery challans:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch delivery challans');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = challanData.find(row => row.challanNumber === id || row._id === id || row.id === id);
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newChallan) => {
    try {
      setLoading(true);
      await createDeliveryChallan(newChallan);
      await fetchDeliveryChallans();
      setCreateShow(false);
      setError(null);
    } catch (err) {
      console.error('Error creating delivery challan:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create delivery challan');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedChallan) => {
    try {
      setLoading(true);
      const challanId = editData?._id || editData?.id;
      await updateDeliveryChallan(challanId, updatedChallan);
      await fetchDeliveryChallans();
      setEditShow(false);
      setEditData(null);
      setError(null);
    } catch (err) {
      console.error('Error updating delivery challan:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update delivery challan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const challanId = deleteData?._id || deleteData?.id;
      await deleteDeliveryChallan(challanId);
      await fetchDeliveryChallans();
      setDeleteShow(false);
      setDeleteData(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting delivery challan:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete delivery challan');
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = challanData.filter(row =>
    row.challanId.toLowerCase().includes(search.toLowerCase()) ||
    row.orderId.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getDispatchTypeColor = (type) => {
    switch (type) {
      case "Express":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Standard":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Same Day":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Scheduled":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  // Loading state
  if (loading && challanData.length === 0) {
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
          placeholder="Search delivery challans..."
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
          Add Delivery Challan
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Challan ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Delivery Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dispatch Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No delivery challans found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((row, index) => {
                const challanNum = row.challanNumber || row.challanId || 'N/A';
                const orderNum = row.orderId?.orderNumber || row.orderNumber || row.orderId || 'N/A';
                const customerName = row.customerId?.name || row.customerId?.customerName || row.customerName || 'N/A';
                const deliveryDate = row.deliveryDate ? new Date(row.deliveryDate).toLocaleDateString() : 'N/A';
                const status = row.status || row.dispatchType || 'Standard';
                const rowId = row._id || row.id || index;
                const totalQty = row.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || row.quantity || 0;
                
                return (
                  <TableRow key={rowId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="left">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {challanNum}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {orderNum}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {customerName}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.items && row.items.length > 0 ? `${row.items.length} item(s)` : (row.productName || 'N/A')}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {totalQty}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">{deliveryDate}</TableCell>
                    <TableCell align="left">
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          ...getDispatchTypeColor(status),
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
      </Box>

      {/* Pagination */}
      {filteredData.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Delivery Challan" :
          viewShow ? "View Delivery Challan" :
          editShow ? "Edit Delivery Challan" :
          deleteShow ? "Delete Delivery Challan" : ""
        }
        dialogContent={
          createShow ? <CreateDeliveryChallan handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewDeliveryChallan viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditDeliveryChallan editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteDeliveryChallan challanData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default DeliveryChallans;