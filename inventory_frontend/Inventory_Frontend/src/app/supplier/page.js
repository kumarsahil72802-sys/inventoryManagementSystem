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
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../components/CommonDialog';
import CreateSupplier from '../../components/supplier/Create';
import EditSupplier from '../../components/supplier/Edit';
import ViewSupplier from '../../components/supplier/View';
import DeleteSupplier from '../../components/supplier/Delete';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier, supplierFromApi } from '../../lib/supplierApi';

const Supplier = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [supplierData, setSupplierData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const loadSuppliers = async (pageNum = page) => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchSuppliers(pageNum, rowsPerPage);
      setSupplierData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [page]);

  const filteredSuppliers = (supplierData || []).filter(supplier =>
    (supplier.supplierName || "").toLowerCase().includes(search.toLowerCase()) ||
    (supplier.contactPerson || "").toLowerCase().includes(search.toLowerCase()) ||
    (supplier.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (supplier.supplierType || "").toLowerCase().includes(search.toLowerCase()) ||
    (supplier.companyName || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
      case "Blocked":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getSupplierTypeColor = (type) => {
    switch (type) {
      case "Electronics":
        return "hrms-badge-primary";
      case "Furniture":
        return "hrms-badge-success";
      case "Kitchenware":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const handleCreateSupplier = () => {
    setSelectedSupplier(null);
    setOpenData(true);
  };

  const handleViewSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setViewShow(true);
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setEditShow(true);
  };

  const handleDeleteSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setDeleteShow(true);
  };

  const handleSaveSupplier = async (formData) => {
    setError("");
    setSaving(true);
    try {
      if (editShow && selectedSupplier?.id) {
        const updated = await updateSupplier(selectedSupplier.id, formData);
        setSupplierData((prev) =>
          prev.map((s) => (s.id === selectedSupplier.id ? supplierFromApi(updated) : s))
        );
      } else {
        const created = await createSupplier(formData);
        setSupplierData((prev) => [supplierFromApi(created), ...prev]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to save supplier");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSupplier?.id) return;
    setError("");
    try {
      await deleteSupplier(selectedSupplier.id);
      setSupplierData((prev) => prev.filter((s) => s.id !== selectedSupplier.id));
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to delete supplier");
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedSupplier(null);
    }, 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
      {/* Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search suppliers..."
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
          onClick={handleCreateSupplier}
        >
          <Add />
          Add Supplier
        </button>
      </Box>

      {/* Supplier Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Supplier ID</TableCell>
                <TableCell>Supplier Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>GST Number</TableCell>
                <TableCell>Supplier Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSuppliers.map((supplier, index) => (
                <TableRow key={supplier.id || supplier._id}>
                  <TableCell>{(pagination.currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {supplier.supplierId || supplier.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {supplier.supplierName}
                    </Typography>
                  </TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.city}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {supplier.gstNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className={`hrms-badge ${getSupplierTypeColor(supplier.supplierType)}`}>
                      {supplier.supplierType}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={`hrms-badge ${getStatusColor(supplier.status)}`}>
                      {supplier.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewSupplier(supplier)}
                        sx={{ color: '#1976d2' }}
                      >
                        <VisibilityOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditSupplier(supplier)}
                        sx={{ color: '#000' }}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSupplier(supplier)}
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
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {pagination.totalItems > 0 ? (pagination.currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(pagination.currentPage * rowsPerPage, pagination.totalItems)} of {pagination.totalItems} suppliers
            </Typography>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        key={selectedSupplier?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Supplier" :
          viewShow ? "Supplier Details" :
          editShow ? "Edit Supplier" :
          deleteShow ? "Delete Supplier" : ""
        }
        dialogContent={
          openData ? (
            <CreateSupplier
              onClose={handleClose}
              onSave={handleSaveSupplier}
              saving={saving}
            />
          ) : viewShow ? (
            <ViewSupplier
              supplierData={selectedSupplier}
            />
          ) : editShow ? (
            <EditSupplier
              supplierData={selectedSupplier}
              onClose={handleClose}
              onSave={handleSaveSupplier}
              saving={saving}
            />
          ) : deleteShow ? (
            <DeleteSupplier
              supplierData={selectedSupplier}
              onClose={handleClose}
              onDelete={handleDeleteConfirm}
            />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default Supplier;