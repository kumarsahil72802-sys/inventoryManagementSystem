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
  Stack,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../components/CommonDialog';
// import CreateValuation from '../../components/valuation/Create';
// import EditValuation from '../../components/valuation/Edit';
// import ViewValuation from '../../components/valuation/View';
// import DeleteValuation from '../../components/valuation/Delete';
import { fetchValuations, createValuation, updateValuation, deleteValuation } from '../../lib/valuationApi';
import { CircularProgress, Alert } from "@mui/material";

const Valuation = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedValuation, setSelectedValuation] = useState(null);
  const [valuationData, setValuationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadValuations();
  }, []);

  const loadValuations = async () => {
    setLoading(true);
    try {
      const data = await fetchValuations();
      setValuationData(data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch valuations');
    } finally {
      setLoading(false);
    }
  };

  const filteredValuations = valuationData.filter(valuation =>
    (valuation.itemName || "").toLowerCase().includes(search.toLowerCase()) ||
    (valuation.sku || "").toLowerCase().includes(search.toLowerCase()) ||
    (valuation.valuationMethod || "").toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Dead Stock":
        return "hrms-badge-error";
      case "Low Stock":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getValuationMethodColor = (method) => {
    switch (method) {
      case "Weighted Average":
        return "hrms-badge-primary";
      case "FIFO":
        return "hrms-badge-success";
      case "LIFO":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getProfitMarginColor = (margin) => {
    if (margin < 0) return "hrms-badge-error";
    if (margin < 10) return "hrms-badge-warning";
    return "hrms-badge-success";
  };

  const handleCreateValuation = () => {
    setSelectedValuation(null);
    setOpenData(true);
  };

  const handleViewValuation = (valuation) => {
    setSelectedValuation(valuation);
    setViewShow(true);
  };

  const handleEditValuation = (valuation) => {
    setSelectedValuation(valuation);
    setEditShow(true);
  };

  const handleDeleteValuation = (valuation) => {
    setSelectedValuation(valuation);
    setDeleteShow(true);
  };

  const handleSaveValuation = async (formData) => {
    try {
      if (editShow) {
        await updateValuation(selectedValuation._id || selectedValuation.id, formData);
      } else {
        await createValuation(formData);
      }
      loadValuations();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save valuation');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteValuation(selectedValuation._id || selectedValuation.id);
      loadValuations();
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to delete valuation');
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedValuation(null);
    }, 100);
  };

  return (
    <div className="content-area">
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search valuations..."
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
          onClick={handleCreateValuation}
        >
          <Add />
          Add Valuation
        </button>
      </Box>

      {/* Valuation Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Unit Cost</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Profit Margin</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredValuations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((valuation, index) => (
                  <TableRow key={valuation._id || index}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {valuation.itemName}
                      </Typography>
                    </TableCell>
                    <TableCell>{valuation.itemId?.category || '-'}</TableCell>
                    <TableCell>{valuation.currentStock || 0}</TableCell>
                    <TableCell>₹{(valuation.averageCost || 0).toLocaleString()}</TableCell>
                    <TableCell>₹{(valuation.totalValue || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getProfitMarginColor(valuation.profitMargin || 0)}`}>
                        {(valuation.profitMargin || 0).toFixed(2)}%
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getValuationMethodColor(valuation.valuationMethod)}`}>
                        {valuation.valuationMethod || 'Active'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewValuation(valuation)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditValuation(valuation)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteValuation(valuation)}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredValuations.length)} of {filteredValuations.length} valuation items
            </Typography>
            <Pagination
              count={Math.ceil(filteredValuations.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>
      )}

      {/* Common Dialog */}
      <CommonDialog
        key={selectedValuation?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Valuation" :
          viewShow ? "Valuation Details" :
          editShow ? "Edit Valuation" :
          deleteShow ? "Delete Valuation" : ""
        }
        dialogContent={
          openData ? (
             <div>CreateValuation missing</div> 
          ) : viewShow ? (
             <div>ViewValuation missing</div> 
          ) : editShow ? (
             <div>EditValuation missing</div> 
          ) : deleteShow ? (
             <div>DeleteValuation missing</div> 
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default Valuation;
