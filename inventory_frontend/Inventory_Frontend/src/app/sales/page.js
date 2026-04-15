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
  Alert
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../components/CommonDialog';
import CreateSales from '../../components/sales/Create';
import EditSales from '../../components/sales/Edit';
import ViewSales from '../../components/sales/View';
import DeleteSales from '../../components/sales/Delete';
import { getAllSalesOrders, createSalesOrder, updateSalesOrder, deleteSalesOrder } from '../../lib/salesApi';

const Sales = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedSales, setSelectedSales] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sales orders on component mount
  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        setLoading(true);
        const response = await getAllSalesOrders();
        // Ensure data is an array
        const fetchedData = Array.isArray(response?.data) ? response.data :
                           (Array.isArray(response) ? response : []);
        setSalesData(fetchedData);
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch sales orders');
      } finally {
        setLoading(false);
      }
    };

    fetchSalesOrders();
  }, []);

  const filteredSales = salesData.filter(sale =>
    sale.salesOrderId.toLowerCase().includes(search.toLowerCase()) ||
    sale.customerName.toLowerCase().includes(search.toLowerCase()) ||
    sale.orderStatus.toLowerCase().includes(search.toLowerCase()) ||
    sale.paymentStatus.toLowerCase().includes(search.toLowerCase())
  );

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "hrms-badge-success";
      case "Pending":
        return "hrms-badge-warning";
      case "Cancelled":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "hrms-badge-success";
      case "Partial":
        return "hrms-badge-warning";
      case "Pending":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const handleCreateSales = () => {
    setSelectedSales(null);
    setOpenData(true);
  };

  const handleViewSales = (sales) => {
    setSelectedSales(sales);
    setViewShow(true);
  };

  const handleEditSales = (sales) => {
    setSelectedSales(sales);
    setEditShow(true);
  };

  const handleDeleteSales = (sales) => {
    setSelectedSales(sales);
    setDeleteShow(true);
  };

  const handleSaveSales = async (formData) => {
    try {
      if (editShow) {
        await updateSalesOrder(selectedSales._id || selectedSales.id, formData);
      } else {
        await createSalesOrder(formData);
      }

      // Refresh the sales orders list
      const response = await getAllSalesOrders();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setSalesData(fetchedData);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save sales order');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSalesOrder(selectedSales._id || selectedSales.id);

      // Refresh the sales orders list
      const response = await getAllSalesOrders();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setSalesData(fetchedData);
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete sales order');
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedSales(null);
    }, 100);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="content-area">

      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search sales orders..."
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
          onClick={handleCreateSales}
        >
          <Add />
          Create Sales Order
        </button>
      </Box>

      {/* Sales Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Sales Order Id</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Order Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSales
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((sale, index) => (
                  <TableRow key={sale.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {sale.salesOrderId}
                      </Typography>
                    </TableCell>
                    <TableCell>{sale.customerName}</TableCell>
                    <TableCell>{sale.orderDate}</TableCell>
                    <TableCell>₹{sale.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getPaymentStatusColor(sale.paymentStatus)}`}>
                        {sale.paymentStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getOrderStatusColor(sale.orderStatus)}`}>
                        {sale.orderStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewSales(sale)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditSales(sale)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteSales(sale)}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredSales.length)} of {filteredSales.length} sales orders
            </Typography>
            <Pagination
              count={Math.ceil(filteredSales.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        key={selectedSales?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Sales Order" :
          viewShow ? "Sales Order Details" :
          editShow ? "Edit Sales Order" :
          deleteShow ? "Delete Sales Order" : ""
        }
        dialogContent={
          openData ? (
            <CreateSales
              onClose={handleClose}
              onSave={handleSaveSales}
            />
          ) : viewShow ? (
            <ViewSales
              salesData={selectedSales}
            />
          ) : editShow ? (
            <EditSales
              salesData={selectedSales}
              onClose={handleClose}
              onSave={handleSaveSales}
            />
          ) : deleteShow ? (
            <DeleteSales
              salesData={selectedSales}
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

export default Sales;
