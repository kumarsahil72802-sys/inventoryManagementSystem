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
import CreateSetup from '../../../components/Warehouse/Setup/Create';
import EditSetup from '../../../components/Warehouse/Setup/Edit';
import ViewSetup from '../../../components/Warehouse/Setup/View';
import DeleteSetup from '../../../components/Warehouse/Setup/Delete';
import CommonDialog from '../../../components/CommonDialog';
import { fetchWarehouses, createWarehouse, updateWarehouse, deleteWarehouse } from '../../../lib/warehouseApi';

const WarehouseSetup = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [warehouseData, setWarehouseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const loadWarehouses = async () => {
    try {
      setLoading(true);
      const data = await fetchWarehouses();
      setWarehouseData(data || []);
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to load warehouses', severity: 'error' });
      setWarehouseData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const filteredWarehouses = warehouseData.filter(warehouse =>
    warehouse.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
    warehouse.city.toLowerCase().includes(search.toLowerCase()) ||
    warehouse.warehouseType.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getWarehouseTypeColor = (type) => {
    switch (type) {
      case "Main":
        return "hrms-badge-primary";
      case "Specialized":
        return "hrms-badge-success";
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
  const handleCreateWarehouse = () => {
    setOpenData(true);
  };

  const handleViewWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setViewShow(true);
  };

  const handleEditWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setEditShow(true);
  };

  const handleDeleteWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDeleteShow(true);
  };

  const handleCreate = async (formData) => {
    try {
      const created = await createWarehouse(formData);
      await loadWarehouses();
      handleClose();
      setSnackbar({ open: true, message: 'Warehouse created successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to create warehouse', severity: 'error' });
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateWarehouse(selectedWarehouse.id, formData);
      await loadWarehouses();
      handleClose();
      setSnackbar({ open: true, message: 'Warehouse updated successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update warehouse', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteWarehouse(selectedWarehouse.id);
      await loadWarehouses();
      handleClose();
      setSnackbar({ open: true, message: 'Warehouse deleted successfully', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete warehouse', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setSelectedWarehouse(null);
  };

  return (
    <div className="content-area">
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search warehouses..."
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
          onClick={handleCreateWarehouse}
        >
          <Add />
          Add Warehouse
        </button>
      </Box>

      {/* Warehouse Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Warehouse Name</TableCell>
                <TableCell>Warehouse Type</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Operating Hours</TableCell>
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
              ) : filteredWarehouses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No warehouses found</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredWarehouses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((warehouse, index) => (
                  <TableRow key={warehouse.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {warehouse.warehouseName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getWarehouseTypeColor(warehouse.warehouseType)}`}>
                        {warehouse.warehouseType}
                      </Box>
                    </TableCell>
                    <TableCell>{warehouse.city}</TableCell>
                    <TableCell>{warehouse.contactPerson}</TableCell>
                    <TableCell>{warehouse.contactPhone}</TableCell>
                    <TableCell>{warehouse.operatingHours}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(warehouse.status)}`}>
                        {warehouse.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewWarehouse(warehouse)}
                          title="View Details"
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditWarehouse(warehouse)}
                          title="Edit Warehouse"
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteWarehouse(warehouse)}
                          title="Delete Warehouse"
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredWarehouses.length)} of {filteredWarehouses.length} warehouses
            </Typography>
            <Pagination
              count={Math.ceil(filteredWarehouses.length / rowsPerPage)}
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
            ? "Add Warehouse"
            : viewShow
            ? "Warehouse Details"
            : editShow
            ? "Edit Warehouse"
            : deleteShow
            ? "Delete Warehouse"
            : ""
        }
        dialogTitleStyle={{ fontWeight: 'bold' }}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
        dialogContent={
          openData ? (
            <CreateSetup 
              handleCreate={handleCreate} 
              handleClose={handleClose} 
            />
          ) : viewShow ? (
            <ViewSetup 
              warehouse={selectedWarehouse} 
              handleClose={handleClose} 
            />
          ) : editShow ? (
            <EditSetup 
              handleUpdate={handleUpdate} 
              handleClose={handleClose} 
              warehouse={selectedWarehouse}
            />
          ) : deleteShow ? (
            <DeleteSetup 
              warehouse={selectedWarehouse} 
              handleDelete={handleDelete}
              handleClose={handleClose}
            />
          ) : null
        }
      
      />

    </div>
  );
};

export default WarehouseSetup;