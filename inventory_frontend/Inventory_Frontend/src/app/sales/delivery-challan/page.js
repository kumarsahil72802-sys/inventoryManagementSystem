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
import CreateDeliveryChallan from "@/components/sales/delivery-challan/Create";
import ViewDeliveryChallan from "@/components/sales/delivery-challan/View";
import EditDeliveryChallan from "@/components/sales/delivery-challan/Edit";
import DeleteDeliveryChallan from "@/components/sales/delivery-challan/Delete";
import { getAllDeliveryChallans, createDeliveryChallan, updateDeliveryChallan, deleteDeliveryChallan } from "@/lib/salesApi";

export default function DeliveryChallan() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createShow, setCreateShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Delivery Challan data - fetched from API
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

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const filteredData = challanData.filter(row =>
    row.challanNumber.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase()) ||
    row.dispatchType.toLowerCase().includes(search.toLowerCase()) ||
    row.status.toLowerCase().includes(search.toLowerCase())
  );

  const currentData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Dispatched":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "In Transit":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Delivered":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
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

      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search delivery challans..."
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
        <button
          className="hrms-btn hrms-btn-primary"
          style={{ height: "40px" }}
          onClick={handleCreateOpen}
        >
          <Add />
          Add Delivery Challan
        </button>
      </Box>

      {/* Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>S. No.</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Challan Number</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Dispatch Type</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Dispatch Date</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No delivery challans found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                currentData.map((row, index) => {
                  const challanNum = row.challanNumber || row.challanId || 'N/A';
                  const customerName = row.customerId?.name || row.customerId?.customerName || row.customerName || 'N/A';
                  const deliveryDate = row.deliveryDate ? new Date(row.deliveryDate).toLocaleDateString() : 
                                       (row.dispatchDate ? new Date(row.dispatchDate).toLocaleDateString() : 'N/A');
                  const status = row.status || 'Dispatched';
                  const rowId = row._id || row.id || index;
                  const totalQty = row.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || row.quantity || 0;
                  const dispatchType = row.status || 'Standard';
                  
                  return (
                    <TableRow key={rowId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                          {challanNum}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {customerName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.items && row.items.length > 0 ? `${row.items.length} item(s)` : (row.productName || 'N/A')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {row.deliveryAddress || row.address || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {totalQty}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={dispatchType}
                          size="small"
                          sx={{
                            backgroundColor: dispatchType === 'Express' ? '#e3f2fd' : '#f3e5f5',
                            color: dispatchType === 'Express' ? '#1976d2' : '#7b1fa2',
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>{deliveryDate}</TableCell>
                      <TableCell>
                        <Chip
                          label={status}
                          size="small"
                          sx={{
                            ...getStatusColor(status),
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell>
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} delivery challans
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
      </Box>

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
}
