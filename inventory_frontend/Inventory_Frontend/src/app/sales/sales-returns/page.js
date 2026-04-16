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
import CreateSalesReturn from "@/components/sales/sales-return/Create";
import ViewSalesReturn from "@/components/sales/sales-return/View";
import EditSalesReturn from "@/components/sales/sales-return/Edit";
import DeleteSalesReturn from "@/components/sales/sales-return/Delete";
import { getAllSalesReturns, createSalesReturn, updateSalesReturn, deleteSalesReturn } from "@/lib/salesApi";

const SalesReturns = () => {
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

  // Sales Returns data - fetched from API
  const [salesData, setSalesData] = useState([]);

  // Fetch sales returns on mount
  useEffect(() => {
    fetchSalesReturns();
  }, []);

  const fetchSalesReturns = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSalesReturns();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setSalesData(fetchedData);
    } catch (err) {
      console.error('Error fetching sales returns:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to fetch sales returns');
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = salesData.find(row => row.returnId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newReturn) => {
    try {
      setLoading(true);
      await createSalesReturn(newReturn);
      await fetchSalesReturns();
      setCreateShow(false);
      setError(null);
    } catch (err) {
      console.error('Error creating sales return:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create sales return');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedReturn) => {
    try {
      setLoading(true);
      const returnId = editData?._id || editData?.id;
      await updateSalesReturn(returnId, updatedReturn);
      await fetchSalesReturns();
      setEditShow(false);
      setEditData(null);
      setError(null);
    } catch (err) {
      console.error('Error updating sales return:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update sales return');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const returnId = deleteData?._id || deleteData?.id;
      await deleteSalesReturn(returnId);
      await fetchSalesReturns();
      setDeleteShow(false);
      setDeleteData(null);
      setError(null);
    } catch (err) {
      console.error('Error deleting sales return:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to delete sales return');
    } finally {
      setLoading(false);
    }
  };

  // Filter data
  const filteredData = salesData.filter(row =>
    row.returnId.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processed":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Approved":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
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
          placeholder="Search sales returns..."
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
          Add Sales Return
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Return ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Return Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No sales returns found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentPageData.map((row, index) => (
                <TableRow key={row.id || row._id || index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {row.returnNumber || row.returnId || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.customerName || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.items && row.items[0]?.itemName ? row.items[0].itemName : (row.productName || 'N/A')}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.items && row.items[0]?.quantity ? row.items[0].quantity : (row.quantity || 0)}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">₹{Number(row.totalAmount || row.returnAmount || 0).toLocaleString()}</TableCell>
                  <TableCell align="left">{row.returnDate ? new Date(row.returnDate).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row.status || 'Pending'}
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
                        onClick={() => handleShowDelete(row.returnId || row._id || row.id)}
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteOutlined />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
     
      {/* Pagination */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} sales returns
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
          createShow ? "Create New Sales Return" :
          viewShow ? "View Sales Return" :
          editShow ? "Edit Sales Return" :
          deleteShow ? "Delete Sales Return" : ""
        }
        dialogContent={
          createShow ? <CreateSalesReturn handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewSalesReturn viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditSalesReturn editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteSalesReturn returnData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default SalesReturns;