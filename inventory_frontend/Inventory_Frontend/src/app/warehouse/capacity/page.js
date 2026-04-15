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
  Stack,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../../components/CommonDialog';
import CreateCapacity from '../../../components/Warehouse/Capacity/Create';
import EditCapacity from '../../../components/Warehouse/Capacity/Edit';
import ViewCapacity from '../../../components/Warehouse/Capacity/View';
import DeleteCapacity from '../../../components/Warehouse/Capacity/Delete';
import { fetchWarehouses, fetchWarehouseCapacities, createWarehouseCapacity, updateWarehouseCapacity, deleteWarehouseCapacity } from '../../../lib/warehouseApi';

const CapacityPlanning = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [capacityData, setCapacityData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedCapacity, setSelectedCapacity] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [caps, whs] = await Promise.all([fetchWarehouseCapacities(), fetchWarehouses()]);
      setCapacityData(caps || []);
      setWarehouses(whs || []);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to load data', severity: 'error' });
      setCapacityData([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCapacity = capacityData.filter(capacity =>
    (capacity.warehouseName || '').toLowerCase().includes(search.toLowerCase()) ||
    ((capacity.storageTypeBreakdown || '').toLowerCase().includes(search.toLowerCase())) ||
    (capacity.status || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Optimal":
        return "hrms-badge-success";
      case "Good":
        return "hrms-badge-primary";
      case "Warning":
        return "hrms-badge-warning";
      case "Critical":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 90) return "hrms-badge-error";
    if (utilization >= 75) return "hrms-badge-warning";
    return "hrms-badge-success";
  };

  const handleBack = () => {
    window.location.href = '/warehouse';
  };

  // CRUD operation functions
  const handleCreateCapacity = () => {
    setOpenData(true);
  };

  const handleViewCapacity = (capacity) => {
    setSelectedCapacity(capacity);
    setViewShow(true);
  };

  const handleEditCapacity = (capacity) => {
    setSelectedCapacity(capacity);
    setEditShow(true);
  };

  const handleDeleteCapacity = (capacity) => {
    setSelectedCapacity(capacity);
    setDeleteShow(true);
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setSelectedCapacity(null);
  };

  const getWarehouseIdFromName = (name) => {
    const w = warehouses.find(x => (x.warehouseName || x.name) === name);
    return w?.id || w?.warehouseId;
  };

  const handleCreate = async (formData) => {
    try {
      const warehouseId = formData.warehouseId || getWarehouseIdFromName(formData.warehouseName);
      if (!warehouseId) {
        setSnackbar({ open: true, message: 'Please select a warehouse', severity: 'error' });
        return;
      }
      await createWarehouseCapacity(formData, warehouseId);
      await loadData();
      handleClose();
      setSnackbar({ open: true, message: 'Capacity plan created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to create capacity plan', severity: 'error' });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      const warehouseId = formData.warehouseId || selectedCapacity?.warehouseId || getWarehouseIdFromName(formData.warehouseName);
      if (!warehouseId) {
        setSnackbar({ open: true, message: 'Warehouse not found', severity: 'error' });
        return;
      }
      await updateWarehouseCapacity(selectedCapacity.id, formData, warehouseId);
      await loadData();
      handleClose();
      setSnackbar({ open: true, message: 'Capacity plan updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update capacity plan', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouseCapacity(selectedCapacity.id);
      await loadData();
      handleClose();
      setSnackbar({ open: true, message: 'Capacity plan deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete capacity plan', severity: 'error' });
    }
  };

  return (
    <div className="content-area">
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search capacity plans..."
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
          onClick={handleCreateCapacity}
        >
          <Add />
          Add Capacity Plan
        </button>
      </Box>

      {/* Capacity Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Warehouse Name</TableCell>
                <TableCell>Total Capacity (Units)</TableCell>
                <TableCell>Available Volume (m³)</TableCell>
                <TableCell>Utilization %</TableCell>
                <TableCell>Throughput/Day</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredCapacity.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No capacity plans found</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredCapacity
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((capacity, index) => (
                  <TableRow key={capacity.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {capacity.warehouseName}
                      </Typography>
                    </TableCell>
                    <TableCell>{(capacity.totalCapacityUnits ?? capacity.totalCapacity ?? 0).toLocaleString()}</TableCell>
                    <TableCell>{(capacity.availableCapacityVolume ?? 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getUtilizationColor(capacity.utilizationPercent)}`}>
                        {capacity.utilizationPercent}%
                      </Box>
                    </TableCell>
                    <TableCell>{capacity.throughputCapacity}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(capacity.status)}`}>
                        {capacity.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewCapacity(capacity)}
                          title="View Details"
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditCapacity(capacity)}
                          title="Edit Capacity Plan"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteCapacity(capacity)}
                          title="Delete Capacity Plan"
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

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredCapacity.length)} of {filteredCapacity.length} capacity plans
            </Typography>
            <Pagination
              count={Math.ceil(filteredCapacity.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* CommonDialog for all operations */}
      <CommonDialog
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData
            ? "Add Capacity Plan"
            : viewShow
            ? "Capacity Details"
            : editShow
            ? "Edit Capacity Plan"
            : deleteShow
            ? "Delete Capacity Plan"
            : ""
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
        dialogContent={
          openData ? (
            <CreateCapacity 
              warehouses={warehouses}
              handleCreate={handleCreate} 
              handleClose={handleClose} 
            />
          ) : viewShow ? (
            <ViewCapacity 
              capacity={selectedCapacity} 
              handleClose={handleClose} 
            />
          ) :           editShow ? (
            <EditCapacity 
              warehouses={warehouses}
              handleUpdate={handleUpdate} 
              handleClose={handleClose} 
              capacity={selectedCapacity}
            />
          ) : deleteShow ? (
            <DeleteCapacity 
              capacity={selectedCapacity} 
              handleDelete={handleDelete} 
              handleClose={handleClose} 
            />
          ) : null
        }
      />
    </div>
  );
};

export default CapacityPlanning;