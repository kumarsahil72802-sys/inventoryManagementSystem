'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined, Refresh } from "@mui/icons-material";
import CommonDialog from '../../../components/CommonDialog';
import CreateRealTimeStock from '../../../components/stock-management-main/RealTimeStock/Create';
import EditRealTimeStock from '../../../components/stock-management-main/RealTimeStock/Edit';
import ViewRealTimeStock from '../../../components/stock-management-main/RealTimeStock/View';
import DeleteRealTimeStock from '../../../components/stock-management-main/RealTimeStock/Delete';
import { fetchRealTimeStock, createRealTimeStock, updateRealTimeStock, deleteRealTimeStock } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchWarehouses } from '@/lib/warehouseApi';

const RealTimeStock = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [realTimeStockData, setRealTimeStockData] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const mapRecord = (rec) => ({
    id: rec._id || rec.id,
    _id: rec._id || rec.id,
    stockId: rec._id?.slice(-6)?.toUpperCase() || '—',
    itemId: rec.itemId?._id || rec.itemId,
    warehouseId: rec.warehouseId?._id || rec.warehouseId,
    productName: rec.itemId?.productName || rec.itemId?.name || '—',
    skuCode: rec.itemId?.SKUcode || rec.itemId?.skuCode || '—',
    warehouseName: rec.warehouseId?.name || '—',
    currentStock: rec.currentStock ?? 0,
    reservedStock: rec.reservedStock ?? 0,
    availableStock: rec.availableStock ?? 0,
    lastMovement: rec.movement || '—',
    movementQuantity: rec.movementQuantity ?? 0,
    movementDate: rec.updatedAt ? new Date(rec.updatedAt).toLocaleString() : '—',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [records, itemsRes, warehousesRes] = await Promise.all([
        fetchRealTimeStock(),
        fetchItems().catch(() => []),
        fetchWarehouses().catch(() => []),
      ]);
      setRealTimeStockData(records.map(mapRecord));
      setItems(itemsRes);
      setWarehouses(warehousesRes);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Failed to load real-time stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds for real-time updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const filteredStock = realTimeStockData.filter(stock =>
    (stock.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.warehouseName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.lastMovement?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.skuCode?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getMovementColor = (movement) => {
    switch (movement) {
      case "Stock In": return "hrms-badge-success";
      case "Stock Out": return "hrms-badge-error";
      case "Stock Transfer": return "hrms-badge-primary";
      default: return "hrms-badge-neutral";
    }
  };

  const getStockLevelColor = (current, available) => {
    if (current === 0) return "hrms-badge-error";
    if (available < 5) return "hrms-badge-warning";
    return "hrms-badge-success";
  };

  const handleCreateStock = () => { setSelectedStock(null); setOpenData(true); };
  const handleViewStock = (stock) => { setSelectedStock(stock); setViewShow(true); };
  const handleEditStock = (stock) => { setSelectedStock(stock); setEditShow(true); };
  const handleDeleteStock = (stock) => { setSelectedStock(stock); setDeleteShow(true); };

  const handleSaveStock = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        itemId: formData.itemId,
        warehouseId: formData.warehouseId,
        currentStock: Number(formData.currentStock),
        availableStock: Number(formData.availableStock),
        reservedStock: Number(formData.reservedStock || 0),
        movement: formData.movement || undefined,
        movementQuantity: Number(formData.movementQuantity || 0),
      };
      if (editShow && selectedStock) {
        await updateRealTimeStock(selectedStock._id, payload);
      } else {
        await createRealTimeStock(payload);
      }
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save stock record');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteRealTimeStock(selectedStock._id);
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete stock record');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedStock(null), 100);
  };

  if (loading && realTimeStockData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="content-area">
      {error && <Box sx={{ mb: 2 }}><Alert severity="error" onClose={() => setError(null)}>{error}</Alert></Box>}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {lastRefresh && (
          <Typography variant="body2" sx={{ color: '#666' }}>
            Last updated: {lastRefresh}
            {loading && <CircularProgress size={12} sx={{ ml: 1 }} />}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', ml: 'auto' }}>
          <TextField
            placeholder="Search real-time stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
          />
          <button
            className="hrms-btn"
            style={{ height: "40px", backgroundColor: '#f5f5f5', border: '1px solid #e0e0e0', color: '#333' }}
            onClick={loadData}
            disabled={loading}
          >
            <Refresh sx={{ fontSize: 18 }} />
          </button>
          <button className="hrms-btn hrms-btn-primary" style={{ height: "40px" }} onClick={handleCreateStock}>
            <Add /> Add Stock Update
          </button>
        </Box>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Stock ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Current Stock</TableCell>
                <TableCell>Reserved</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Last Movement</TableCell>
                <TableCell>Movement Qty</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStock.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0
                ? filteredStock.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((stock, index) => (
                  <TableRow key={stock.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>{stock.stockId}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{stock.productName}</Typography></TableCell>
                    <TableCell>{stock.skuCode}</TableCell>
                    <TableCell>{stock.warehouseName}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStockLevelColor(stock.currentStock, stock.availableStock)}`}>
                        {stock.currentStock}
                      </Box>
                    </TableCell>
                    <TableCell>{stock.reservedStock}</TableCell>
                    <TableCell>{stock.availableStock}</TableCell>
                    <TableCell>
                      {stock.lastMovement !== '—' ? (
                        <Box className={`hrms-badge ${getMovementColor(stock.lastMovement)}`}>
                          {stock.lastMovement}
                        </Box>
                      ) : '—'}
                    </TableCell>
                    <TableCell>{stock.movementQuantity}</TableCell>
                    <TableCell sx={{ fontSize: '0.75rem', color: '#666' }}>{stock.movementDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewStock(stock)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleEditStock(stock)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteStock(stock)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
                : <TableRow><TableCell colSpan={12} align="center" sx={{ py: 3 }}>No real-time stock data available</TableCell></TableRow>
              }
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {filteredStock.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredStock.length)} of {filteredStock.length} real-time stock items
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

      <CommonDialog
        key={selectedStock?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Stock Update" :
          viewShow ? "Real-Time Stock Details" :
          editShow ? "Edit Stock Update" :
          deleteShow ? "Delete Stock Update" : ""
        }
        dialogContent={
          openData ? (
            <CreateRealTimeStock onClose={handleClose} onSave={handleSaveStock} items={items} warehouses={warehouses} loading={saving} />
          ) : viewShow ? (
            <ViewRealTimeStock stockData={selectedStock} />
          ) : editShow ? (
            <EditRealTimeStock stockData={selectedStock} onClose={handleClose} onSave={handleSaveStock} items={items} warehouses={warehouses} loading={saving} />
          ) : deleteShow ? (
            <DeleteRealTimeStock stockData={selectedStock} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default RealTimeStock;