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
import CreateFIFO from "@/components/valuation/fifo/Create";
import ViewFIFO from "@/components/valuation/fifo/View";
import EditFIFO from "@/components/valuation/fifo/Edit";
import DeleteFIFO from "@/components/valuation/fifo/Delete";
import { fetchFifoLifoWeighted, createFifoLifoWeighted, updateFifoLifoWeighted, deleteFifoLifoWeighted } from "@/lib/valuationApi";
import { CircularProgress, Alert } from "@mui/material";

const FIFOLIFOWeighted = () => {
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

  const [fifoData, setFifoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchFifoLifoWeighted();
      setFifoData(data || []);
      setError('');
    } catch (err) {
      setError(err.message || "Failed to fetch data");
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

  const handleCreate = async (newFifo) => {
    try {
      await createFifoLifoWeighted(newFifo);
      loadData();
      setCreateShow(false);
    } catch (err) {
      setError(err.message || 'Failed to create record');
    }
  };

  const handleUpdate = async (updatedFifo) => {
    try {
      await updateFifoLifoWeighted(updatedFifo._id || updatedFifo.id, updatedFifo);
      loadData();
      setEditShow(false);
    } catch (err) {
      setError(err.message || 'Failed to update record');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFifoLifoWeighted(deleteId);
      loadData();
      setDeleteShow(false);
      setDeleteData(null);
      setDeleteId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete record');
    }
  };

  // Filter data
  const filteredData = fifoData.filter(row =>
    (row._id || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.itemId?.productName || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.valuationMethod || "").toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getMethodColor = (method) => {
    switch (method) {
      case "FIFO":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "LIFO":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Weighted Average":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
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
          placeholder="Search inventory valuation..."
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
          Add Valuation Entry
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
              <TableCell sx={{ fontWeight: 'bold' }}>Valuation ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Method</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Opening Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Closing Stock</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Value</TableCell>
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
                    {row.itemId?.productName || 'Unknown Item'}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Chip
                    label={row.valuationMethod || 'N/A'}
                    size="small"
                    sx={{
                      ...getMethodColor(row.valuationMethod),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="left">{row.openingStock || 0}</TableCell>
                <TableCell align="left">{row.totalStock || 0}</TableCell>
                <TableCell align="left">₹{(row.averageCost || 0).toLocaleString()}</TableCell>
                <TableCell align="left">₹{(row.totalValue || 0).toLocaleString()}</TableCell>
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} valuation records
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
          createShow ? "Create New Valuation Entry" :
          viewShow ? "View Valuation Entry" :
          editShow ? "Edit Valuation Entry" :
          deleteShow ? "Delete Valuation Entry" : ""
        }
        dialogContent={
          createShow ? <CreateFIFO handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewFIFO viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditFIFO editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteFIFO fifoData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default FIFOLIFOWeighted;
