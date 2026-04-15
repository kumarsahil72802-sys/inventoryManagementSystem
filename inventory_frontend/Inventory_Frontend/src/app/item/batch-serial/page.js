'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from '../../../components/CommonDialog';
import CreateBatch from '../../../components/BatchTracking/Create';
import EditBatch from '../../../components/BatchTracking/Edit';
import ViewBatch from '../../../components/BatchTracking/View';
import DeleteBatch from '../../../components/BatchTracking/Delete';
import {
  fetchBatchSerialRecords,
  createBatchSerialRecord,
  updateBatchSerialRecord,
  deleteBatchSerialRecord,
} from '@/lib/itemApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchSuppliers } from '@/lib/supplierApi';

const BatchSerialTracking = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batchData, setBatchData] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetchBatchSerialRecords(),
      fetchItems(),
      fetchSuppliers(),
    ])
      .then(([batches, items, supps]) => {
        setBatchData(batches);
        setProducts(items || []);
        setSuppliers(supps || []);
      })
      .catch((err) => setError(err.message || 'Failed to load batches'))
      .finally(() => setLoading(false));
  }, []);

  const filteredBatches = batchData.filter(batch =>
    (batch.productName || '').toLowerCase().includes(search.toLowerCase()) ||
    (batch.batchNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (batch.serialNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (batch.supplier || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "hrms-badge-success";
      case "Expired": return "hrms-badge-error";
      case "Low Stock": return "hrms-badge-warning";
      default: return "hrms-badge-neutral";
    }
  };

  const handleCreateBatch = () => {
    setSelectedBatch(null);
    setOpenData(true);
  };

  const handleViewBatch = (batch) => {
    setSelectedBatch(batch);
    setViewShow(true);
  };

  const handleEditBatch = (batch) => {
    setSelectedBatch(batch);
    setEditShow(true);
  };

  const handleDeleteBatch = (batch) => {
    setSelectedBatch(batch);
    setDeleteShow(true);
  };

  const handleSaveBatch = async (payload) => {
    setError('');
    try {
      const data = {
        ...payload,
        productId: payload.productId || payload.itemId,
        supplierId: payload.supplierId || payload.supplier,
      };
      if (editShow && selectedBatch?.id) {
        const updated = await updateBatchSerialRecord(selectedBatch.id, data);
        setBatchData(prev => prev.map(b => b.id === selectedBatch.id ? enrichBatch(updated) : b));
      } else {
        const created = await createBatchSerialRecord(data);
        setBatchData(prev => [enrichBatch(created), ...prev]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save batch');
    }
  };

  const handleDeleteConfirm = async (id) => {
    const batchId = id || selectedBatch?.id;
    if (!batchId) return;
    setError('');
    try {
      await deleteBatchSerialRecord(batchId);
      setBatchData(prev => prev.filter(b => b.id !== batchId));
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to delete batch');
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedBatch(null), 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const productOptions = (Array.isArray(products) ? products : []).map(p => ({ id: p.id || p.productId, name: p.productName || p.skuCode || p.id }));
  const supplierOptions = (Array.isArray(suppliers) ? suppliers : []).map(s => ({ id: s.id || s.supplierId, name: s.supplierName || s.name || s.companyName || s.id }));

  const enrichBatch = (batch) => {
    if (!batch) return batch;
    const product = productOptions.find(p => String(p.id) === String(batch.productId));
    const supplier = supplierOptions.find(s => String(s.id) === String(batch.supplierId || batch.supplier));
    return {
      ...batch,
      productName: product?.name || batch.productName || '-',
      supplier: supplier?.name || batch.supplier || '-',
    };
  };

  if (loading) {
    return (
      <div className="content-area">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <TextField
          placeholder="Search batches..."
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
          onClick={handleCreateBatch}
        >
          <Add />
          Add Batch
        </button>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Batch Number</TableCell>
                <TableCell>Serial Numbers</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Manufacturing Date</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBatches
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((batch, index) => (
                  <TableRow key={batch.id || batch._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {batch.productName || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                        {batch.batchNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{batch.serialNumber || '-'}</TableCell>
                    <TableCell>{batch.quantity ?? batch.totalQuantity ?? 0}</TableCell>
                    <TableCell>{batch.manufacturingDate || batch.purchaseDate || '-'}</TableCell>
                    <TableCell>{batch.expiryDate || '-'}</TableCell>
                    <TableCell>{batch.supplier || '-'}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewBatch(batch)} sx={{ color: '#1976d2' }}>
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditBatch(batch)} sx={{ color: '#ff9800' }}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteBatch(batch)} sx={{ color: '#f44336' }}>
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredBatches.length)} of {filteredBatches.length} batches
            </Typography>
            <Pagination
              count={Math.ceil(filteredBatches.length / rowsPerPage) || 1}
              page={page + 1}
              onChange={handlePageChange}
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
          openData ? "Add Batch" :
          viewShow ? "Batch Details" :
          editShow ? "Edit Batch" :
          deleteShow ? "Delete Batch" : ""
        }
        dialogContent={
          openData ? (
            <CreateBatch
              onClose={handleClose}
              onSave={handleSaveBatch}
              products={productOptions}
              suppliers={supplierOptions}
            />
          ) : viewShow ? (
            <ViewBatch batchData={selectedBatch} />
          ) : editShow ? (
            <EditBatch
              batchData={selectedBatch}
              onClose={handleClose}
              onSave={handleSaveBatch}
              products={productOptions}
              suppliers={supplierOptions}
            />
          ) : deleteShow ? (
            <DeleteBatch
              batchData={selectedBatch}
              onClose={handleClose}
              onDelete={(id) => handleDeleteConfirm(id)}
            />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default BatchSerialTracking;
