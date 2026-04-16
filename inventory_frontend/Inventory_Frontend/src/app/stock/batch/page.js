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
import CreateBatch from '../../../components/stock-management-main/Batch/Create';
import EditBatch from '../../../components/stock-management-main/Batch/Edit';
import ViewBatch from '../../../components/stock-management-main/Batch/View';
import DeleteBatch from '../../../components/stock-management-main/Batch/Delete';

import { fetchStockBatches, createStockBatch, updateStockBatch, deleteStockBatch } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchWarehouses } from '@/lib/warehouseApi';
import { fetchSuppliers } from '@/lib/supplierApi';

const BatchManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [batchData, setBatchData] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const mapRecord = (rec) => ({
    id: rec._id || rec.id,
    _id: rec._id || rec.id,
    itemId: rec.itemId?._id || rec.itemId,
    warehouseId: rec.warehouseId?._id || rec.warehouseId,
    supplierId: rec.supplierId?._id || rec.supplierId,
    productName: rec.itemId?.productName || rec.itemId?.name || '—',
    warehouseName: rec.warehouseId?.name || rec.warehouseId?.warehouseName || '—',
    supplierName: rec.supplierId?.name || rec.supplierId?.supplierName || '—',
    batchNumber: rec.batchNumber || '—',
    quantity: rec.quantity || 0,
    availableQuantity: rec.availableQuantity || 0,
    reservedQuantity: rec.reservedQuantity || 0,
    purchaseDate: rec.purchaseDate || '',
    expiryDate: rec.expiryDate || '',
    purchasePrice: rec.purchasePrice || 0,
    sellingPrice: rec.sellingPrice || 0,
    costPrice: rec.costPrice || 0,
    status: rec.status || 'Active',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [records, itemsRes, warehousesRes, suppliersRes] = await Promise.all([
        fetchStockBatches(),
        fetchItems().catch(() => []),
        fetchWarehouses().catch(() => []),
        fetchSuppliers().catch(() => []),
      ]);
      setBatchData(records.map(mapRecord));
      setItems(itemsRes);
      setWarehouses(warehousesRes);
      setSuppliers(suppliersRes);
    } catch (err) {
      setError(err.message || 'Failed to load stock batches');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredBatches = batchData.filter(batch =>
    (batch.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (batch.batchNumber?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (batch.warehouseName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (batch.status?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "hrms-badge-success";
      case "expired": return "hrms-badge-error";
      case "depleted": return "hrms-badge-warning";
      case "damaged": return "hrms-badge-error";
      default: return "hrms-badge-neutral";
    }
  };

  const handleCreateBatch = () => { setSelectedBatch(null); setOpenData(true); };
  const handleViewBatch = (batch) => { setSelectedBatch(batch); setViewShow(true); };
  const handleEditBatch = (batch) => { setSelectedBatch(batch); setEditShow(true); };
  const handleDeleteBatch = (batch) => { setSelectedBatch(batch); setDeleteShow(true); };

  const handleSaveBatch = async (formData) => {
    setSaving(true);
    try {
      const payload = {
        itemId: formData.itemId,
        batchNumber: formData.batchNumber,
        warehouseId: formData.warehouseId,
        quantity: Number(formData.quantity || 0),
        availableQuantity: Number(formData.availableQuantity || formData.quantity || 0),
        purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : new Date().toISOString(),
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        supplierId: formData.supplierId || undefined,
        purchasePrice: Number(formData.purchasePrice || 0),
        sellingPrice: Number(formData.sellingPrice || 0),
        costPrice: Number(formData.costPrice || 0),
        status: formData.status || 'Active',
        // Pass a mock ID for createdBy if one is required and missing
        createdBy: formData.createdBy || "661234567890123456789012"
      };

      if (editShow && selectedBatch) {
        await updateStockBatch(selectedBatch._id, payload);
      } else {
        await createStockBatch(payload);
      }
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save stock batch');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteStockBatch(selectedBatch._id);
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete stock batch');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedBatch(null), 100);
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>Stock Batches</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Manage sub-component product batches and inventory</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            placeholder="Search batches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ width: "250px", "& .MuiOutlinedInput-root": { height: "40px" } }}
          />
          <button className="hrms-btn hrms-btn-primary" style={{ height: "40px" }} onClick={handleCreateBatch}>
            <Add /> Add Stock Batch
          </button>
        </Box>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Batch No</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Warehouse</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Available</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).length > 0
                ? filteredBatches.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((batch, index) => (
                  <TableRow key={batch.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>{batch.batchNumber}</Typography>
                    </TableCell>
                    <TableCell><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{batch.productName}</Typography></TableCell>
                    <TableCell>{batch.warehouseName}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{batch.availableQuantity}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewBatch(batch)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleEditBatch(batch)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                        <IconButton size="small" onClick={() => handleDeleteBatch(batch)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
                : <TableRow><TableCell colSpan={8} align="center" sx={{ py: 3 }}>No stock batch records found</TableCell></TableRow>
              }
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {filteredBatches.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredBatches.length)} of {filteredBatches.length} stock batches
            </Typography>
            <Pagination
              count={Math.ceil(filteredBatches.length / rowsPerPage) || 1}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      <CommonDialog
        key={selectedBatch?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Stock Batch" :
          viewShow ? "Stock Batch Details" :
          editShow ? "Edit Stock Batch" :
          deleteShow ? "Delete Stock Batch" : ""
        }
        dialogContent={
          openData ? (
            <CreateBatch onClose={handleClose} onSave={handleSaveBatch} items={items} warehouses={warehouses} suppliers={suppliers} loading={saving} />
          ) : viewShow ? (
            <ViewBatch batchData={selectedBatch} onClose={handleClose} />
          ) : editShow ? (
            <EditBatch batchData={selectedBatch} onClose={handleClose} onSave={handleSaveBatch} items={items} warehouses={warehouses} suppliers={suppliers} loading={saving} />
          ) : deleteShow ? (
            <DeleteBatch batchData={selectedBatch} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default BatchManagement;
