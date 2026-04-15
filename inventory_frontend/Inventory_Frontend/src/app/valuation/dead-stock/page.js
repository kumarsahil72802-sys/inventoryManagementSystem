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
import CreateDeadStock from "@/components/valuation/dead-stock/Create";
import ViewDeadStock from "@/components/valuation/dead-stock/View";
import EditDeadStock from "@/components/valuation/dead-stock/Edit";
import DeleteDeadStock from "@/components/valuation/dead-stock/Delete";
import { fetchDeadStock, createDeadStock, updateDeadStock, deleteDeadStock } from "@/lib/valuationApi";
import { CircularProgress, Alert } from "@mui/material";

const DeadStock = () => {
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

  const [deadStockData, setDeadStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchDeadStock();
      setDeadStockData(data || []);
      setError('');
    } catch (err) {
      setError(err.message || "Failed to fetch dead stock");
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id, row) => { 
    setDeleteId(id); 
    setDeleteData(row);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newDeadStock) => {
    try {
      await createDeadStock(newDeadStock);
      loadData();
      setCreateShow(false);
    } catch (err) {
      setError(err.message || "Failed to create dead stock");
    }
  };

  const handleUpdate = async (updatedDeadStock) => {
    try {
      await updateDeadStock(updatedDeadStock._id || updatedDeadStock.id, updatedDeadStock);
      loadData();
      setEditShow(false);
    } catch (err) {
      setError(err.message || "Failed to update dead stock");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDeadStock(deleteId);
      loadData();
      setDeleteShow(false);
      setDeleteData(null);
      setDeleteId(null);
    } catch (err) {
      setError(err.message || "Failed to delete dead stock");
    }
  };

  // Filter data
  const filteredData = deadStockData.filter(row =>
    (row._id || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.itemName || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Identified":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Action Required":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      case "Write-off":
        return { backgroundColor: "#f5f5f5", color: "#666" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search dead stock..."
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
          Add Dead Stock Entry
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dead Stock ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Days in Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Current Value</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Depreciation %</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={row._id || index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row._id ? row._id.substring(row._id.length - 6) : '-'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.itemName || 'Unknown'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.itemId?.category || '-'}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.daysSinceLastMovement || 0}</TableCell>
                <TableCell align="left">₹{(row.costPrice || 0).toLocaleString()}</TableCell>
                <TableCell align="left">₹{(row.totalValue || 0).toLocaleString()}</TableCell>
                <TableCell align="left">-</TableCell>
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
                      onClick={() => handleShowDelete(row._id || row.id, row)}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} dead stock records
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
      )}

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Dead Stock Entry" :
          viewShow ? "View Dead Stock Entry" :
          editShow ? "Edit Dead Stock Entry" :
          deleteShow ? "Delete Dead Stock Entry" : ""
        }
        dialogContent={
          createShow ? <CreateDeadStock handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewDeadStock viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditDeadStock editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteDeadStock deadStockData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default DeadStock;
