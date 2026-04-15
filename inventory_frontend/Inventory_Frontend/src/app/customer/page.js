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
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../components/CommonDialog';
import CreateCustomer from '../../components/Customer Management/Create';
import EditCustomer from '../../components/Customer Management/Edit';
import ViewCustomer from '../../components/Customer Management/View';
import DeleteCustomer from '../../components/Customer Management/Delete';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, customerFromApi } from '../../lib/customerApi';

const Customer = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const loadCustomers = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchCustomers(pageNum, rowsPerPage);
      setCustomerData(result.data);
      setPagination(result.pagination);
    } catch (e) {
      setError(e.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const filteredCustomers = customerData.filter(customer =>
    customer.customerName.toLowerCase().includes(search.toLowerCase()) ||
    customer.email.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone.includes(search) ||
    customer.customerType.toLowerCase().includes(search.toLowerCase())
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

  const getCustomerTypeColor = (type) => {
    switch (type) {
      case "Corporate":
        return "hrms-badge-primary";
      case "Wholesale":
        return "hrms-badge-success";
      case "Retail":
      case "Individual":
        return "hrms-badge-neutral";
      default:
        return "hrms-badge-neutral";
    }
  };

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setOpenData(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setViewShow(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setEditShow(true);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setDeleteShow(true);
  };

  const handleSaveCustomer = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      if (editShow && selectedCustomer?.id) {
        const updated = await updateCustomer(selectedCustomer.id, formData);
        setCustomerData((prev) =>
          prev.map((c) => (c.id === selectedCustomer.id ? customerFromApi(updated) : c))
        );
      } else {
        const created = await createCustomer(formData);
        setCustomerData((prev) => [customerFromApi(created), ...prev]);
      }
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to save customer");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer?.id) return;
    setSaving(true);
    setError(null);
    try {
      await deleteCustomer(selectedCustomer.id);
      setCustomerData((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to delete customer");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedCustomer(null);
    }, 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading customers...</Typography>
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>
          {error}
        </Box>
      )}
      {/* Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search customers..."
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
          onClick={handleCreateCustomer}
        >
          <Add />
          Add Customer
        </button>
      </Box>

      {/* Customer Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Customer ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>GST Number</TableCell>
                <TableCell>Customer Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customerData.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>{(pagination.currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {customer.customerId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {customer.customerName}
                    </Typography>
                  </TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {customer.gstNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box className={`hrms-badge ${getCustomerTypeColor(customer.customerType)}`}>
                      {customer.customerType}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box className={`hrms-badge ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleViewCustomer(customer)}
                        sx={{ color: '#1976d2' }}
                      >
                        <VisibilityOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEditCustomer(customer)}
                        sx={{ color: '#000' }}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCustomer(customer)}
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
              Showing {pagination.totalItems > 0 ? (pagination.currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(pagination.currentPage * rowsPerPage, pagination.totalItems)} of {pagination.totalItems} customers
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
        key={selectedCustomer?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Customer" :
          viewShow ? "Customer Details" :
          editShow ? "Edit Customer" :
          deleteShow ? "Delete Customer" : ""
        }
        dialogContent={
          openData ? (
            <CreateCustomer
              onClose={handleClose}
              onSave={handleSaveCustomer}
              saving={saving}
            />
          ) : viewShow ? (
            <ViewCustomer
              customerData={selectedCustomer}
            />
          ) : editShow ? (
            <EditCustomer
              customerData={selectedCustomer}
              onClose={handleClose}
              onSave={handleSaveCustomer}
              saving={saving}
            />
          ) : deleteShow ? (
            <DeleteCustomer
              customerData={selectedCustomer}
              onClose={handleClose}
              onDelete={handleDeleteConfirm}
              saving={saving}
            />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default Customer;