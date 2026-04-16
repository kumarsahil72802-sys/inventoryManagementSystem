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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";

import { fetchDamageRecords, createDamageRecord, updateDamageRecord, deleteDamageRecord } from '../../lib/damageApi';
import CreateDamage from '../../components/damage-tracking/Create';
import EditDamage from '../../components/damage-tracking/Edit';
import ViewDamage from '../../components/damage-tracking/View';
import DeleteDamage from '../../components/damage-tracking/Delete';

const Damage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  // Real data from API
  const [damageData, setDamageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDamage, setSelectedDamage] = useState(null);

  // Fetch damage records from API
  const loadDamageRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchDamageRecords(page + 1, rowsPerPage);
      setDamageData(response.data || []);
      setPagination(response.pagination || { currentPage: 1, totalPages: 1, totalItems: 0 });
    } catch (err) {
      setError(err.message || "Failed to fetch damage records");
      console.error("Error fetching damage records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDamageRecords();
  }, [page]);

  const filteredDamages = damageData.filter(damage =>
    damage.damageId.toLowerCase().includes(search.toLowerCase()) ||
    damage.productName.toLowerCase().includes(search.toLowerCase()) ||
    damage.damageType.toLowerCase().includes(search.toLowerCase()) ||
    damage.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "hrms-badge-success";
      case "Under Review":
        return "hrms-badge-warning";
      case "Rejected":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getDamageTypeColor = (type) => {
    switch (type) {
      case "Physical Damage":
        return "hrms-badge-error";
      case "Water Damage":
        return "hrms-badge-primary";
      case "Breakage":
        return "hrms-badge-warning";
      case "Electrical Damage":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getActionTakenColor = (action) => {
    switch (action) {
      case "Write-off":
        return "hrms-badge-error";
      case "Return to Supplier":
        return "hrms-badge-primary";
      case "Insurance Claim":
        return "hrms-badge-warning";
      case "Pending":
        return "hrms-badge-neutral";
      default:
        return "hrms-badge-neutral";
    }
  };

  // CRUD Handlers
  const handleCreate = async (formData) => {
    try {
      await createDamageRecord(formData);
      setCreateDialogOpen(false);
      loadDamageRecords();
    } catch (err) {
      console.error("Error creating damage record:", err);
      alert(err.message || "Failed to create damage record");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateDamageRecord(selectedDamage.id, formData);
      setEditDialogOpen(false);
      setSelectedDamage(null);
      loadDamageRecords();
    } catch (err) {
      console.error("Error updating damage record:", err);
      alert(err.message || "Failed to update damage record");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDamageRecord(selectedDamage.id);
      setDeleteDialogOpen(false);
      setSelectedDamage(null);
      loadDamageRecords();
    } catch (err) {
      console.error("Error deleting damage record:", err);
      alert(err.message || "Failed to delete damage record");
    }
  };

  const openViewDialog = (damage) => {
    setSelectedDamage(damage);
    setViewDialogOpen(true);
  };

  const openEditDialog = (damage) => {
    setSelectedDamage(damage);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (damage) => {
    setSelectedDamage(damage);
    setDeleteDialogOpen(true);
  };

  const closeDialogs = () => {
    setCreateDialogOpen(false);
    setEditDialogOpen(false);
    setViewDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedDamage(null);
  };

  return (
    <div className="content-area">
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search damage reports..."
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
          onClick={() => setCreateDialogOpen(true)}
        >
          <Add />
          Report Damage
        </button>
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
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Damage Id</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Damage Date</TableCell>
                <TableCell>Damage Type</TableCell>
                <TableCell>Total Loss</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDamages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((damage, index) => (
                  <TableRow key={damage.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {damage.damageId}
                      </Typography>
                    </TableCell>
                    <TableCell>{damage.productName}</TableCell>
                    <TableCell>{damage.damageDate}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getDamageTypeColor(damage.damageType)}`}>
                        {damage.damageType}
                      </Box>
                    </TableCell>
                    <TableCell>₹{damage.totalLoss.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(damage.status)}`}>
                        {damage.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => openViewDialog(damage)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => openEditDialog(damage)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => openDeleteDialog(damage)}
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

        <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredDamages.length)} of {filteredDamages.length} damage reports
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
      </Box>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={closeDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Report Damage</DialogTitle>
        <DialogContent>
          <CreateDamage handleClose={closeDialogs} handleCreate={handleCreate} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={closeDialogs} maxWidth="md" fullWidth>
        <DialogTitle>Edit Damage Report</DialogTitle>
        <DialogContent>
          <EditDamage editData={selectedDamage} handleClose={closeDialogs} handleUpdate={handleUpdate} />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={closeDialogs} maxWidth="md" fullWidth>
        <DialogTitle>View Damage Report</DialogTitle>
        <DialogContent>
          <ViewDamage viewData={selectedDamage} handleClose={closeDialogs} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogs} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Delete Damage Report</DialogTitle>
        <DialogContent>
          <DeleteDamage damageData={selectedDamage} onClose={closeDialogs} onDelete={handleDelete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Damage;
