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
import CreateStockIn from '../../../components/Stock Management/StockInOut/CreateStockIn';
import EditStockIn from '../../../components/Stock Management/StockInOut/EditStockIn';
import ViewStockIn from '../../../components/Stock Management/StockInOut/ViewStockIn';
import DeleteStockIn from '../../../components/Stock Management/StockInOut/DeleteStockIn';
import CreateStockOut from '../../../components/Stock Management/StockInOut/CreateStockOut';
import EditStockOut from '../../../components/Stock Management/StockInOut/EditStockOut';
import ViewStockOut from '../../../components/Stock Management/StockInOut/ViewStockOut';
import DeleteStockOut from '../../../components/Stock Management/StockInOut/DeleteStockOut';
import { fetchStockInOut, createStockInOut, updateStockInOut, deleteStockInOut } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchSuppliers } from '@/lib/supplierApi';

const StockInOut = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [tabValue, setTabValue] = useState(0);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const [stockInData, setStockInData] = useState([]);
  const [stockOutData, setStockOutData] = useState([]);
  const [items, setItems] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const mapRecord = (rec) => ({
    id: rec._id || rec.id,
    _id: rec._id || rec.id,
    // Stock In fields
    stockInId: rec._id,
    stockOutId: rec._id,
    itemId: rec.itemId?._id || rec.itemId,
    productName: rec.itemId?.productName || rec.itemId?.name || rec.productName || '—',
    skuCode: rec.itemId?.SKUcode || rec.itemId?.skuCode || '—',
    transactionType: rec.transactionType,
    quantity: rec.quantity || 0,
    quantityIn: rec.transactionType === 'Stock In' ? rec.quantity : 0,
    quantityOut: rec.transactionType === 'Stock Out' ? rec.quantity : 0,
    perPiecePrice: rec.perPiecePrice || 0,
    totalCost: rec.totalCost || (rec.perPiecePrice && rec.quantity ? Number(rec.perPiecePrice) * rec.quantity : 0),
    supplierId: rec.supplierId?._id || rec.supplierId,
    supplierName: rec.supplierId?.name || rec.supplierId?.supplierName || '—',
    invoice: rec.invoice || '—',
    entryDate: rec.entryDate ? new Date(rec.entryDate).toISOString().split('T')[0] : (rec.createdAt ? new Date(rec.createdAt).toISOString().split('T')[0] : '—'),
    dateOfStockIn: rec.entryDate ? new Date(rec.entryDate).toISOString().split('T')[0] : (rec.createdAt ? new Date(rec.createdAt).toISOString().split('T')[0] : '—'),
    dateOfStockOut: rec.entryDate ? new Date(rec.entryDate).toISOString().split('T')[0] : (rec.createdAt ? new Date(rec.createdAt).toISOString().split('T')[0] : '—'),
    paymentStatus: rec.paymentStatus ? (rec.paymentStatus.charAt(0).toUpperCase() + rec.paymentStatus.slice(1)) : 'Pending',
    customerName: rec.customerName || '—',
    totalSale: rec.totalCost || 0,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [records, itemsRes, suppliersRes] = await Promise.all([
        fetchStockInOut(),
        fetchItems().catch(() => []),
        fetchSuppliers().catch(() => []),
      ]);
      const mapped = records.map(mapRecord);
      setStockInData(mapped.filter(r => r.transactionType === 'Stock In'));
      setStockOutData(mapped.filter(r => r.transactionType === 'Stock Out'));
      setItems(itemsRes);
      setSuppliers(suppliersRes);
    } catch (err) {
      setError(err.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredStockIn = stockInData.filter(stock =>
    (stock.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.supplierName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.invoice?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const filteredStockOut = stockOutData.filter(stock =>
    (stock.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (stock.customerName?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "paid": return "hrms-badge-success";
      case "pending": return "hrms-badge-warning";
      case "overdue": return "hrms-badge-error";
      default: return "hrms-badge-neutral";
    }
  };

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
    setPage(0);
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
        transactionType: tabValue === 0 ? 'Stock In' : 'Stock Out',
        quantity: Number(formData.quantityIn || formData.quantityOut || formData.quantity),
        perPiecePrice: formData.purchasePrice || formData.perPiecePrice || '',
        totalCost: formData.totalCost || '',
        supplierId: formData.supplierId || undefined,
        invoice: formData.invoice || '',
        entryDate: formData.dateOfStockIn || formData.dateOfStockOut || formData.entryDate || new Date().toISOString(),
        paymentStatus: (formData.paymentStatus || 'pending').toLowerCase(),
      };
      if (editShow && selectedStock) {
        await updateStockInOut(selectedStock._id, payload);
      } else {
        await createStockInOut(payload);
      }
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteStockInOut(selectedStock._id);
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete record');
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

  const currentData = tabValue === 0 ? filteredStockIn : filteredStockOut;
  const currentPageData = currentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['Stock In', 'Stock Out'].map((label, i) => (
            <Box
              key={i}
              onClick={() => handleTabChange(i)}
              sx={{
                px: 4, py: 0.5, height: '40px', display: 'flex', alignItems: 'center',
                borderRadius: '6px', cursor: 'pointer',
                backgroundColor: tabValue === i ? '#1976D2' : 'transparent',
                color: tabValue === i ? 'white' : '#666',
                fontWeight: tabValue === i ? 600 : 400,
                border: '1px solid #e0e0e0', transition: 'all 0.2s ease',
                '&:hover': { backgroundColor: tabValue === i ? '#1565C0' : '#f5f5f5' }
              }}
            >{label}</Box>
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            placeholder={`Search ${tabValue === 0 ? 'stock in' : 'stock out'}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
          />
          <button className="hrms-btn hrms-btn-primary" style={{ height: "40px" }} onClick={handleCreateStock}>
            <Add /> Add {tabValue === 0 ? 'Stock In' : 'Stock Out'}
          </button>
        </Box>
      </Box>

      <Box className="hrms-card">
        {tabValue === 0 && (
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Stock In ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Total Cost</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Date of Stock In</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length > 0 ? currentPageData.map((stock, index) => (
                  <TableRow key={stock.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {stock._id?.slice?.(-6)?.toUpperCase() || stock.stockInId}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{stock.productName}</Typography></TableCell>
                    <TableCell>{stock.quantityIn || stock.quantity}</TableCell>
                    <TableCell>₹{Number(stock.totalCost || 0).toLocaleString()}</TableCell>
                    <TableCell>{stock.supplierName}</TableCell>
                    <TableCell>{stock.invoice}</TableCell>
                    <TableCell>{stock.dateOfStockIn}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getPaymentStatusColor(stock.paymentStatus)}`}>
                        {stock.paymentStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewStock(stock)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleEditStock(stock)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteStock(stock)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3 }}>No stock in records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        {tabValue === 1 && (
          <Box className="hrms-card-content" sx={{ padding: 0 }}>
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>S. No.</TableCell>
                  <TableCell>Stock Out ID</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Date of Stock Out</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentPageData.length > 0 ? currentPageData.map((stock, index) => (
                  <TableRow key={stock.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {stock._id?.slice?.(-6)?.toUpperCase() || stock.stockOutId}
                      </Typography>
                    </TableCell>
                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{stock.productName}</Typography></TableCell>
                    <TableCell>{stock.quantityOut || stock.quantity}</TableCell>
                    <TableCell>{stock.dateOfStockOut}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getPaymentStatusColor(stock.paymentStatus)}`}>
                        {stock.paymentStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewStock(stock)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleEditStock(stock)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteStock(stock)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>No stock out records found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </Box>
        )}

        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {currentData.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, currentData.length)} of {currentData.length} {tabValue === 0 ? 'stock in' : 'stock out'} records
            </Typography>
            <Pagination
              count={Math.ceil(currentData.length / rowsPerPage) || 1}
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
          openData ? `Add ${tabValue === 0 ? 'Stock In' : 'Stock Out'}` :
          viewShow ? `${tabValue === 0 ? 'Stock In' : 'Stock Out'} Details` :
          editShow ? `Edit ${tabValue === 0 ? 'Stock In' : 'Stock Out'}` :
          deleteShow ? `Delete ${tabValue === 0 ? 'Stock In' : 'Stock Out'}` : ""
        }
        dialogContent={
          openData ? (
            tabValue === 0 ? (
              <CreateStockIn onClose={handleClose} onSave={handleSaveStock} items={items} suppliers={suppliers} loading={saving} />
            ) : (
              <CreateStockOut onClose={handleClose} onSave={handleSaveStock} items={items} loading={saving} />
            )
          ) : viewShow ? (
            tabValue === 0 ? <ViewStockIn stockData={selectedStock} /> : <ViewStockOut stockData={selectedStock} />
          ) : editShow ? (
            tabValue === 0 ? (
              <EditStockIn stockData={selectedStock} onClose={handleClose} onSave={handleSaveStock} items={items} suppliers={suppliers} loading={saving} />
            ) : (
              <EditStockOut stockData={selectedStock} onClose={handleClose} onSave={handleSaveStock} items={items} loading={saving} />
            )
          ) : deleteShow ? (
            tabValue === 0 ? (
              <DeleteStockIn stockData={selectedStock} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
            ) : (
              <DeleteStockOut stockData={selectedStock} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
            )
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default StockInOut;