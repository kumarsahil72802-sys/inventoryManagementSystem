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
import CreateWriteOff from "@/components/damage-tracking/write-off/Create";
import ViewWriteOff from "@/components/damage-tracking/write-off/View";
import EditWriteOff from "@/components/damage-tracking/write-off/Edit";
import DeleteWriteOff from "@/components/damage-tracking/write-off/Delete";
import { fetchWriteOffs, createWriteOff, updateWriteOff, deleteWriteOff } from '../../../lib/damageApi';

const StockWriteOff = () => {
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

  // Real data from API
  const [damageData, setDamageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Fetch write-off records from API
  const loadWriteOffData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchWriteOffs(page + 1, rowsPerPage);
      setDamageData(response.data || []);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
    } catch (err) {
      setError(err.message || "Failed to fetch write-off records");
      console.error("Error fetching write-off records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWriteOffData();
  }, [page]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = damageData.find(row => row.id === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newWriteOff) => {
    try {
      await createWriteOff(newWriteOff);
      setCreateShow(false);
      loadWriteOffData();
    } catch (err) {
      console.error("Error creating write-off:", err);
      alert(err.message || "Failed to create write-off");
    }
  };

  const handleUpdate = async (updatedWriteOff) => {
    try {
      await updateWriteOff(updatedWriteOff.id, updatedWriteOff);
      setEditShow(false);
      setEditData(null);
      loadWriteOffData();
    } catch (err) {
      console.error("Error updating write-off:", err);
      alert(err.message || "Failed to update write-off");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWriteOff(deleteId);
      setDeleteShow(false);
      setDeleteData(null);
      setDeleteId(null);
      loadWriteOffData();
    } catch (err) {
      console.error("Error deleting write-off:", err);
      alert(err.message || "Failed to delete write-off");
    }
  };

  // Filter data
  const filteredData = damageData.filter(row =>
    row.productName?.toLowerCase().includes(search.toLowerCase()) ||
    row.writeOffReason?.toLowerCase().includes(search.toLowerCase()) ||
    row.status?.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
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
          placeholder="Search write-off records..."
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
          Write-off
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Table */}
          <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Write-off Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Write-off Reason</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
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
                    <TableCell align="left">{row.writeOffDate}</TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.writeOffReason}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">₹{(row.unitCost || 0).toLocaleString()}</TableCell>
                    <TableCell align="left">₹{(row.totalValue || 0).toLocaleString()}</TableCell>
                    <TableCell align="left">{row.createdBy}</TableCell>
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
                    <TableCell align="left">{row.warehouseName}</TableCell>
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
          <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} write-off records
              </Typography>
              <Pagination
                count={pagination.totalPages}
                page={page + 1}
                onChange={(_, newPage) => setPage(newPage - 1)}
                size="small"
                color="primary"
              />
            </Stack>
          </Box>
        </>
      )}

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create Write-off" :
          viewShow ? "View Write-off" :
          editShow ? "Edit Write-off" :
          deleteShow ? "Delete Write-off" : ""
        }
        dialogContent={
          createShow ? <CreateWriteOff handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewWriteOff viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditWriteOff editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteWriteOff writeOffData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default StockWriteOff;