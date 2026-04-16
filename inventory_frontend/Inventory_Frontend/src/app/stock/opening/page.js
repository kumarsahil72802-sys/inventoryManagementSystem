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
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../../components/CommonDialog';
import CreateOpeningStock from '../../../components/stock-management-main/OpeningStock/Create';
import EditOpeningStock from '../../../components/stock-management-main/OpeningStock/Edit';
import ViewOpeningStock from '../../../components/stock-management-main/OpeningStock/View';
import DeleteOpeningStock from '../../../components/stock-management-main/OpeningStock/Delete';
import { fetchOpeningStock, createOpeningStock, updateOpeningStock, deleteOpeningStock } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchWarehouses } from '@/lib/warehouseApi';
import { fetchSuppliers } from '@/lib/supplierApi';

const OpeningStock = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [openingStockData, setOpeningStockData] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const mapRecord = (rec) => ({
    id: rec._id || rec.id,
    _id: rec._id || rec.id,
    stockId: rec._id?.slice(-6)?.toUpperCase() || '—',
    itemId: rec.itemId?._id || rec.itemId,
    warehouseId: rec.warehouseId?._id || rec.warehouseId,
    supplierId: rec.supplierId?._id || rec.supplierId,
    productName: rec.itemId?.productName || rec.itemId?.name || '—',
    warehouseName: rec.warehouseId?.name || '—',
    supplierName: rec.supplierId?.name || rec.supplierId?.supplierName || '—',
    openingQuantity: rec.quantity || 0,
    unitPrice: parseFloat(rec.unitPrice) || 0,
    totalValue: (rec.quantity || 0) * (parseFloat(rec.unitPrice) || 0),
    openingDate: rec.openingDate ? new Date(rec.openingDate).toISOString().split('T')[0] : (rec.createdAt ? new Date(rec.createdAt).toISOString().split('T')[0] : '—'),
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [records, itemsRes, warehousesRes, suppliersRes] = await Promise.all([
        fetchOpeningStock(),
        fetchItems().catch(() => []),
        fetchWarehouses().catch(() => []),
        fetchSuppliers().catch(() => []),
      ]);
      setOpeningStockData(records.map(mapRecord));
      setItems(itemsRes);
      setWarehouses(warehousesRes);
      setSuppliers(suppliersRes);
    } catch (err) {
      setError(err.message || 'Failed to load opening stock');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredStock = openingStockData.filter(stock =>
    (stock.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.warehouseName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.supplierName?.toLowerCase() || '').includes(search.toLowerCase())
  );

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
        supplierId: formData.supplierId || undefined,
        quantity: Number(formData.openingQuantity || formData.quantity),
        unitPrice: String(formData.unitPrice || 0),
        openingDate: formData.openingDate ? new Date(formData.openingDate).toISOString() : new Date().toISOString(),
      };
      if (editShow && selectedStock) {
        await updateOpeningStock(selectedStock._id, payload);
      } else {
        await createOpeningStock(payload);
      }
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save opening stock');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteOpeningStock(selectedStock._id);
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete opening stock');
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="content-area">
      {error && <Box sx={{ mb: 2 }}><Alert severity="error" onClose={() => setError(null)}>{error}</Alert></Box>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search opening stock..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
        <button className="hrms-btn hrms-btn-primary" style={{ height: "40px" }} onClick={handleCreateStock}>
          <Add /> Add Opening Stock
        </button>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Stock ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Opening Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Opening Date</TableCell>
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
                    <TableCell>{stock.warehouseName}</TableCell>
                    <TableCell>{stock.supplierName}</TableCell>
                    <TableCell>{stock.openingQuantity}</TableCell>
                    <TableCell>₹{Number(stock.unitPrice).toLocaleString()}</TableCell>
                    <TableCell>₹{Number(stock.totalValue).toLocaleString()}</TableCell>
                    <TableCell>{stock.openingDate}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewStock(stock)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleEditStock(stock)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteStock(stock)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
                : <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3 }}>No opening stock records found</TableCell></TableRow>
              }
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {filteredStock.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredStock.length)} of {filteredStock.length} opening stock items
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
          openData ? "Add Opening Stock" :
          viewShow ? "Opening Stock Details" :
          editShow ? "Edit Opening Stock" :
          deleteShow ? "Delete Opening Stock" : ""
        }
        dialogContent={
          openData ? (
            <CreateOpeningStock onClose={handleClose} onSave={handleSaveStock} items={items} warehouses={warehouses} suppliers={suppliers} loading={saving} />
          ) : viewShow ? (
            <ViewOpeningStock stockData={selectedStock} />
          ) : editShow ? (
            <EditOpeningStock stockData={selectedStock} onClose={handleClose} onSave={handleSaveStock} items={items} warehouses={warehouses} suppliers={suppliers} loading={saving} />
          ) : deleteShow ? (
            <DeleteOpeningStock stockData={selectedStock} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default OpeningStock;