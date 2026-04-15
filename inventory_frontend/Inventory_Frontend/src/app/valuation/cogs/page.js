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
import CreateCOGS from "@/components/valuation/cogs/Create";
import ViewCOGS from "@/components/valuation/cogs/View";
import EditCOGS from "@/components/valuation/cogs/Edit";
import DeleteCOGS from "@/components/valuation/cogs/Delete";
import { fetchCOGS, createCOGS, updateCOGS, deleteCOGS } from "@/lib/valuationApi";
import { CircularProgress, Alert } from "@mui/material";

const COGS = () => {
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

  const [cogsData, setCogsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchCOGS();
      setCogsData(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch COGS data');
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

  const handleCreate = async (newCogs) => {
    try {
      await createCOGS(newCogs);
      loadData();
      setCreateShow(false);
    } catch (err) {
      setError(err.message || 'Failed to create COGS record');
    }
  };

  const handleUpdate = async (updatedCogs) => {
    try {
      await updateCOGS(updatedCogs._id || updatedCogs.id, updatedCogs);
      loadData();
      setEditShow(false);
    } catch (err) {
      setError(err.message || 'Failed to update COGS record');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCOGS(deleteId);
      loadData();
      setDeleteShow(false);
      setDeleteData(null);
      setDeleteId(null);
    } catch (err) {
      setError(err.message || 'Failed to delete COGS record');
    }
  };

  // Filter data
  const filteredData = cogsData.filter(row =>
    (row._id || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.itemName || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getMarginColor = (margin) => {
    if (margin >= 30) return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
    if (margin >= 20) return { backgroundColor: "#e3f2fd", color: "#1976d2" };
    if (margin >= 10) return { backgroundColor: "#fff3e0", color: "#f57c00" };
    return { backgroundColor: "#ffebee", color: "#d32f2f" };
  };

  return (
    <div className="content-area">
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search COGS..."
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
          Add COGS Entry
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
              <TableCell sx={{ fontWeight: 'bold' }}>COGS ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cost Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Selling Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity Sold</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gross Margin %</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Period</TableCell>
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
                <TableCell align="left">₹{(row.averageCost || 0).toLocaleString()}</TableCell>
                <TableCell align="left">-</TableCell>
                <TableCell align="left">{row.salesQuantity || 0}</TableCell>
                <TableCell align="left">
                  <Chip
                    label={`${row.grossProfitMargin || 0}%`}
                    size="small"
                    sx={{
                      ...getMarginColor(row.grossProfitMargin || 0),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="left">
                  {row.period?.startDate ? new Date(row.period.startDate).toLocaleDateString() : '-'}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} COGS records
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
          createShow ? "Create New COGS Entry" :
          viewShow ? "View COGS Entry" :
          editShow ? "Edit COGS Entry" :
          deleteShow ? "Delete COGS Entry" : ""
        }
        dialogContent={
          createShow ? <CreateCOGS handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewCOGS viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditCOGS editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteCOGS cogsData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default COGS;
