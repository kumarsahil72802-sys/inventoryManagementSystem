"use client"
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Pagination,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Search,
  VisibilityOutlined,
  EditOutlined,
  DeleteOutline
} from '@mui/icons-material';
import { getAllIncomes, createIncome, updateIncome, deleteIncome } from '@/lib/financeApi';
import CommonDialog from '@/components/CommonDialog';
import Create from '@/components/finance/income/Create';
import Edit from '@/components/finance/income/Edit';
import View from '@/components/finance/income/View';
import Delete from '@/components/finance/income/Delete';

export default function Income() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [ViewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    amount: "",
    category: "",
    warehouse: "",
    date: "",
    client: "",
    paymentMethod: "",
    dueDate: "",
    receivedDate: "",
    description: ""
  });

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const response = await getAllIncomes();
      if (response.success) {
        setIncomes(response.data);
      }
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Income Name is required";
    if (!formData.type) newErrors.type = "Income Type is required";
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Valid Amount is required";
    }
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.warehouse) newErrors.warehouse = "Warehouse is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.client) newErrors.client = "Client is required";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Payment Method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleView = (row) => {
    setViewData(row);
    setViewShow(true);
  };

  const handleEdit = (data) => {
    setEditData(data);
    setFormData({
      ...data,
      date: data.date ? new Date(data.date).toISOString().split('T')[0] : "",
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : "",
      receivedDate: data.receivedDate ? new Date(data.receivedDate).toISOString().split('T')[0] : ""
    });
    setEditShow(true);
  };

  const handleDelete = (income) => {
    setViewData(income);
    setDeleteShow(true);
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setViewData(null);
    setErrors({});
    setFormData({
      name: "",
      type: "",
      amount: "",
      category: "",
      warehouse: "",
      date: "",
      client: "",
      paymentMethod: "",
      dueDate: "",
      receivedDate: "",
      description: ""
    });
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await createIncome(formData);
      if (response.success) {
        handleClose();
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error creating income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const response = await updateIncome(editData._id || editData.id, formData);
      if (response.success) {
        handleClose();
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error updating income:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await deleteIncome(ViewData._id || ViewData.id);
      if (response.success) {
        handleClose();
        fetchIncomes();
      }
    } catch (error) {
      console.error("Error deleting income:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = incomes.filter(income =>
    (income.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (income.client || "").toLowerCase().includes(search.toLowerCase()) ||
    (income.warehouse || "").toLowerCase().includes(search.toLowerCase())
  );

  const startIndex = (page - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'hrms-badge-success';
      case 'Inactive': return 'hrms-badge-error';
      case 'Pending': return 'hrms-badge-warning';
      default: return 'hrms-badge-default';
    }
  };

  return (
    <Box sx={{ padding: "0.5rem" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginBottom: "1.5rem", gap: 2 }}>
        <TextField
          placeholder="Search incomes..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#fff" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#6b7280" }} />
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenData(true)}
          sx={{ borderRadius: "8px", textTransform: "none", backgroundColor: "#3b82f6", "&:hover": { backgroundColor: "#2563eb" } }}
        >
          Add Income
        </Button>
      </Box>

      {loading && incomes.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
      ) : (
        <Box className="hrms-card">
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No</TableCell>
                  <TableCell>Income Name</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Warehouse</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((income, index) => (
                  <TableRow key={income._id || income.id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{income.name}</Typography>
                    </TableCell>
                    <TableCell>{income.client}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#10b981" }}>₹{(income.amount || 0).toLocaleString()}</TableCell>
                    <TableCell>{income.warehouse}</TableCell>
                    <TableCell>{income.date ? new Date(income.date).toLocaleDateString() : "-"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleView(income)} sx={{ color: "#3b82f6" }}><VisibilityOutlined fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleEdit(income)} sx={{ color: "#6b7280" }}><EditOutlined fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(income)} sx={{ color: "#ef4444" }}><DeleteOutline fontSize="small" /></IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderTop: "1px solid #e5e7eb" }}>
            <Typography variant="body2" color="text.secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length} records
            </Typography>
            <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" shape="rounded" size="small" />
          </Box>
        </Box>
      )}

      <CommonDialog
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add New Income" : viewShow ? "View Income Details" : editShow ? "Edit Income" : "Delete Income"
        }
        dialogContent={
          openData ? (
            <Create formData={formData} handleInputChange={handleFormChange} errors={errors} />
          ) : viewShow ? (
            <View selectedData={ViewData} getStatusColor={getStatusColor} />
          ) : editShow ? (
            <Edit formData={formData} handleInputChange={handleFormChange} errors={errors} />
          ) : deleteShow ? (
            <Delete selectedData={ViewData} />
          ) : null
        }
        primaryAction={openData || editShow || deleteShow}
        primaryActionText={openData ? "Create" : editShow ? "Update" : "Delete"}
        primaryActionColor={deleteShow ? "error" : "primary"}
        onPrimaryAction={openData ? handleCreate : editShow ? handleUpdate : handleDeleteConfirm}
        secondaryActionText={viewShow ? "Close" : "Cancel"}
        showActions={!viewShow}
        maxWidth={deleteShow ? "xs" : "md"}
        fullWidth={!deleteShow}
      />
    </Box>
  );
}
