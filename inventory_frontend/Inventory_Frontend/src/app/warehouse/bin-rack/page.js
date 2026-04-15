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
import CreateBinRack from '../../../components/Warehouse/BinRack/Create';
import EditBinRack from '../../../components/Warehouse/BinRack/Edit';
import ViewBinRack from '../../../components/Warehouse/BinRack/View';
import DeleteBinRack from '../../../components/Warehouse/BinRack/Delete';
import CommonDialog from '../../../components/CommonDialog';
import { fetchWarehouses, fetchBinRacks, createBinRack, updateBinRack, deleteBinRack } from '../../../lib/warehouseApi';

const BinRackManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [binRackData, setBinRackData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedBinRack, setSelectedBinRack] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bins, whs] = await Promise.all([fetchBinRacks(), fetchWarehouses()]);
      setBinRackData(bins || []);
      setWarehouses(whs || []);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to load data', severity: 'error' });
      setBinRackData([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBinRacks = binRackData.filter(binRack =>
    binRack.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
    binRack.binType.toLowerCase().includes(search.toLowerCase()) ||
    binRack.zone.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
        return "hrms-badge-error";
      case "Maintenance":
        return "hrms-badge-warning";
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
  const handleCreateBinRack = () => {
    setSelectedBinRack(null);
    setOpenData(true);
  };

  const handleViewBinRack = (binRack) => {
    setSelectedBinRack(binRack);
    setViewShow(true);
  };

  const handleEditBinRack = (binRack) => {
    setSelectedBinRack(binRack);
    setEditShow(true);
  };

  const handleDeleteBinRack = (binRack) => {
    setSelectedBinRack(binRack);
    setDeleteShow(true);
  };

  const getWarehouseIdFromName = (name) => {
    const w = warehouses.find(x => (x.warehouseName || x.name) === name);
    return w?.id || w?.warehouseId;
  };

  const handleSaveBinRack = async (formData) => {
    try {
      const warehouseId = formData.warehouseId || getWarehouseIdFromName(formData.warehouseName);
      if (!warehouseId) {
        setSnackbar({ open: true, message: 'Please select a warehouse', severity: 'error' });
        return;
      }
      if (selectedBinRack) {
        await updateBinRack(selectedBinRack.id, formData, warehouseId);
        setSnackbar({ open: true, message: 'Bin/Rack updated successfully', severity: 'success' });
      } else {
        await createBinRack(formData, warehouseId);
        setSnackbar({ open: true, message: 'Bin/Rack created successfully', severity: 'success' });
      }
      await loadData();
      handleClose();
      setSelectedBinRack(null);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to save bin/rack', severity: 'error' });
    }
  };

  const handleDeleteConfirm = async (binRackId) => {
    try {
      await deleteBinRack(binRackId);
      await loadData();
      setDeleteShow(false);
      setSelectedBinRack(null);
      setSnackbar({ open: true, message: 'Bin/Rack deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete bin/rack', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedBinRack(null);
    }, 200);
  };

  return (
    <div className="content-area">
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search bins/racks..."
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
          onClick={handleCreateBinRack}
        >
          <Add />
          Add Bin/Rack
        </button>
      </Box>

      {/* Bin/Rack Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Warehouse Name</TableCell>
                <TableCell>Bin ID</TableCell>
                <TableCell>Zone</TableCell>
                <TableCell>Bin Type</TableCell>
                <TableCell>Capacity (kg)</TableCell>
                <TableCell>Occupancy (kg)</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : filteredBinRacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No bins/racks found</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredBinRacks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((binRack, index) => (
                  <TableRow key={binRack.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {binRack.warehouseName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1976D2' }}>
                        {binRack.binId}
                      </Typography>
                    </TableCell>
                    <TableCell>{binRack.zone}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${binRack.binType === 'Pallet Bin' ? 'hrms-badge-primary' : binRack.binType === 'Shelf Bin' ? 'hrms-badge-success' : 'hrms-badge-warning'}`}>
                        {binRack.binType}
                      </Box>
                    </TableCell>
                    <TableCell>{binRack.binCapacityWeight} kg</TableCell>
                    <TableCell>{binRack.currentOccupancyWeight} kg</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(binRack.status)}`}>
                        {binRack.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewBinRack(binRack)}
                          title="View Details"
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditBinRack(binRack)}
                          title="Edit Bin/Rack"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteBinRack(binRack)}
                          title="Delete Bin/Rack"
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredBinRacks.length)} of {filteredBinRacks.length} bins/racks
            </Typography>
            <Pagination
              count={Math.ceil(filteredBinRacks.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* CommonDialog for all CRUD operations */}
      <CommonDialog
        key={selectedBinRack?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Bin/Rack" :
          viewShow ? "Bin/Rack Details" :
          editShow ? "Edit Bin/Rack" :
          deleteShow ? "Delete Bin/Rack" : ""
        }
        dialogContent={
          openData ? (
            <CreateBinRack
              warehouses={warehouses}
              onClose={handleClose}
              onSave={handleSaveBinRack}
            />
          ) : viewShow ? (
            <ViewBinRack
              binRackData={selectedBinRack}
              onClose={handleClose}
              onEdit={handleEditBinRack}
              onDelete={handleDeleteBinRack}
            />
          ) :           editShow ? (
            <EditBinRack
              warehouses={warehouses}
              binRackData={selectedBinRack}
              onClose={handleClose}
              onSave={handleSaveBinRack}
            />
          ) : deleteShow ? (
            <DeleteBinRack
              binRackData={selectedBinRack}
              onClose={handleClose}
              onConfirm={handleDeleteConfirm}
            />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default BinRackManagement;