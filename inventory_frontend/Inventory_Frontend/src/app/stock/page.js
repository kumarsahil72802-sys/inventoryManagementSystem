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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  MenuItem
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { fetchRealTimeStock, createRealTimeStock, updateRealTimeStock, deleteRealTimeStock } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchWarehouses } from '@/lib/warehouseApi';

const Stock = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  
  const [stockData, setStockData] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [openModal, setOpenModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStockId, setSelectedStockId] = useState(null);
  
  const initialForm = {
    itemId: '',
    warehouseId: '',
    currentStock: 0,
    availableStock: 0,
    reservedStock: 0,
  };
  const [formData, setFormData] = useState(initialForm);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [stockRes, itemsRes, warehouseRes] = await Promise.all([
        fetchRealTimeStock(),
        fetchItems().catch(() => []),
        fetchWarehouses().catch(() => [])
      ]);
      setStockData(Array.isArray(stockRes) ? stockRes : []);
      setItems(itemsRes);
      setWarehouses(warehouseRes);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenModal = (stock = null) => {
    if (stock) {
      setIsEditMode(true);
      setSelectedStockId(stock.id);
      setFormData({
        itemId: stock.rawItem?._id || stock.rawItem || '',
        warehouseId: stock.rawWarehouse?._id || stock.rawWarehouse || '',
        currentStock: stock.currentStock !== '—' ? stock.currentStock : 0,
        availableStock: stock.availableStock !== '—' ? stock.availableStock : 0,
        reservedStock: stock.reservedStock !== '—' ? stock.reservedStock : 0,
      });
    } else {
      setIsEditMode(false);
      setSelectedStockId(null);
      setFormData(initialForm);
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFormData(initialForm);
  };

  const handleSaveStock = async () => {
    setLoadingData(true);
    try {
      const payload = {
        itemId: formData.itemId,
        warehouseId: formData.warehouseId,
        currentStock: Number(formData.currentStock),
        availableStock: Number(formData.availableStock),
        reservedStock: Number(formData.reservedStock),
      };

      if (isEditMode) {
        await updateRealTimeStock(selectedStockId, payload);
      } else {
        await createRealTimeStock(payload);
      }
      
      handleCloseModal();
      await loadAllData();
    } catch (err) {
      alert(err.message || "Failed to save stock");
    } finally {
      setLoadingData(false);
    }
  };

  const handleOpenDelete = (id) => {
    setSelectedStockId(id);
    setDeleteModal(true);
  };

  const handleDeleteStock = async () => {
    setLoadingData(true);
    try {
      await deleteRealTimeStock(selectedStockId);
      setDeleteModal(false);
      await loadAllData();
    } catch (err) {
      alert(err.message || "Failed to delete stock");
    } finally {
      setLoadingData(false);
    }
  };

  const getMappedStock = (stock) => {
    return {
      id: stock._id || '—',
      stockId: stock._id || '—',
      rawItem: stock.itemId,
      rawWarehouse: stock.warehouseId,
      productName: stock.itemId?.productName || stock.itemId?.name || stock.itemName || stock.productName || '—',
      skuCode: stock.itemId?.skuCode || stock.itemId?.SKUcode || stock.skuCode || '—',
      warehouseName: stock.warehouseId?.name || stock.warehouseId?.warehouseName || stock.warehouseName || '—',
      currentStock: stock.currentStock !== undefined ? stock.currentStock : (stock.quantity !== undefined ? stock.quantity : '—'),
      reservedStock: stock.reservedStock !== undefined ? stock.reservedStock : '—',
      availableStock: stock.availableStock !== undefined ? stock.availableStock : '—',
      reorderLevel: stock.itemId?.reorderLevel || stock.reorderLevel !== undefined ? stock.reorderLevel : '—',
      maxStock: stock.itemId?.maxStock || stock.maxStock !== undefined ? stock.maxStock : '—',
      unitPrice: stock.itemId?.sellingPrice || stock.unitPrice !== undefined ? stock.unitPrice : '—',
      totalValue: stock.totalValue !== undefined ? stock.totalValue : '—',
      lastUpdated: stock.lastUpdated ? new Date(stock.lastUpdated).toISOString().split('T')[0] : (stock.updatedAt ? new Date(stock.updatedAt).toISOString().split('T')[0] : '—'),
      batchNumber: stock.batchNumber || '—',
      expiryDate: stock.expiryDate ? new Date(stock.expiryDate).toISOString().split('T')[0] : '—',
      status: stock.status || 'In Stock'
    };
  };

  const processedData = stockData.map(getMappedStock);

  const filteredStock = processedData.filter(stock =>
    (stock.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.skuCode?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.warehouseName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.batchNumber?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock": return "hrms-badge-success";
      case "Low Stock": return "hrms-badge-warning";
      case "Out of Stock": return "hrms-badge-error";
      default: return "hrms-badge-neutral";
    }
  };

  const getStockLevelColor = (current, reorder) => {
    if (current === '—' || reorder === '—') return "hrms-badge-neutral";
    if (current <= reorder) return "hrms-badge-error";
    if (current <= reorder * 2) return "hrms-badge-warning";
    return "hrms-badge-success";
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><Search /></InputAdornment>
            ),
          }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
        <button
          className="hrms-btn hrms-btn-primary"
          style={{ height: "40px" }}
          onClick={() => handleOpenModal()}
        >
          <Add /> Add Stock Entry
        </button>
      </Box>

      {/* Stock Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU Code</TableCell>
                <TableCell>Warehouse Name</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Reserved Stock</TableCell>
                <TableCell>Available Stock</TableCell>
                <TableCell>Reorder Level</TableCell>
                <TableCell>Max Stock</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStock.length > 0 ? (
                filteredStock
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((stock, index) => (
                    <TableRow key={stock.id}>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {stock.productName}
                        </Typography>
                      </TableCell>
                      <TableCell>{stock.skuCode}</TableCell>
                      <TableCell>{stock.warehouseName}</TableCell>
                      <TableCell>
                        <Box className={`hrms-badge ${getStockLevelColor(stock.currentStock, stock.reorderLevel)}`}>
                          {stock.currentStock}
                        </Box>
                      </TableCell>
                      <TableCell>{stock.reservedStock}</TableCell>
                      <TableCell>{stock.availableStock}</TableCell>
                      <TableCell>{stock.reorderLevel}</TableCell>
                      <TableCell>{stock.maxStock}</TableCell>
                      <TableCell>{stock.unitPrice !== '—' && !isNaN(stock.unitPrice) ? `₹${Number(stock.unitPrice).toLocaleString()}` : '—'}</TableCell>
                      <TableCell>
                        <Box className={`hrms-badge ${getStatusColor(stock.status)}`}>
                          {stock.status}
                        </Box>
                      </TableCell>
                      <TableCell>{stock.lastUpdated}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: "0.25rem" }}>
                          <IconButton size="small" sx={{ color: "#000", fontSize: "16px" }} onClick={() => handleOpenModal(stock)}>
                            <EditOutlined />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#d32f2f", fontSize: "16px" }} onClick={() => handleOpenDelete(stock.id)}>
                            <DeleteOutlined />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={13} align="center" sx={{ py: 3 }}>
                    No stock data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {filteredStock.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredStock.length)} of {filteredStock.length} stock items
            </Typography>
            <Pagination
              count={Math.ceil(filteredStock.length / rowsPerPage) || 1}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* CREATE/EDIT MODAL */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? "Edit Stock Entry" : "Add Stock Entry"}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Item"
                value={formData.itemId}
                onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
                variant="outlined"
                size="small"
              >
                {items.map(item => (
                  <MenuItem key={item.id} value={item.id}>{item.productName} ({item.skuCode})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Warehouse"
                value={formData.warehouseId}
                onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                variant="outlined"
                size="small"
              >
                {warehouses.map(wh => (
                  <MenuItem key={wh.id} value={wh.id}>{wh.warehouseName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Current Stock"
                type="number"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Available Stock"
                type="number"
                value={formData.availableStock}
                onChange={(e) => setFormData({ ...formData, availableStock: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Reserved Stock"
                type="number"
                value={formData.reservedStock}
                onChange={(e) => setFormData({ ...formData, reservedStock: e.target.value })}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">Cancel</Button>
          <Button onClick={handleSaveStock} variant="contained" color="primary" disabled={loadingData || !formData.itemId || !formData.warehouseId}>
            {loadingData ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE MODAL */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this stock entry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModal(false)} color="inherit">Cancel</Button>
          <Button onClick={handleDeleteStock} variant="contained" color="error" disabled={loadingData}>
             {loadingData ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Stock;
