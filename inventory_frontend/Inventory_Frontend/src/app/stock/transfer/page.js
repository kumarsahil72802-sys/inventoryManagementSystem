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
import CreateStockTransfer from '../../../components/Stock Management/StockTransfer/Create';
import EditStockTransfer from '../../../components/Stock Management/StockTransfer/Edit';
import ViewStockTransfer from '../../../components/Stock Management/StockTransfer/View';
import DeleteStockTransfer from '../../../components/Stock Management/StockTransfer/Delete';
import { fetchStockTransfers, createStockTransfer, updateStockTransfer, deleteStockTransfer } from '@/lib/stockApi';
import { fetchItems } from '@/lib/itemApi';
import { fetchWarehouses } from '@/lib/warehouseApi';

const StockTransfer = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  const [stockTransferData, setStockTransferData] = useState([]);
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const mapTransfer = (rec) => ({
    id: rec._id || rec.id,
    _id: rec._id || rec.id,
    transferId: rec.transferNumber || rec._id?.slice(-6)?.toUpperCase() || '—',
    transferNumber: rec.transferNumber,
    fromWarehouseId: rec.fromWarehouse?._id || rec.fromWarehouse,
    toWarehouseId: rec.toWarehouse?._id || rec.toWarehouse,
    fromWarehouse: rec.fromWarehouse?.name || '—',
    toWarehouse: rec.toWarehouse?.name || '—',
    items: rec.items || [],
    // For display: show first item's product name or count
    productName: rec.items?.length > 0
      ? (rec.items[0]?.itemId?.productName || rec.items[0]?.itemId?.name || `${rec.items.length} item(s)`)
      : '—',
    transferQuantity: rec.items?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0,
    totalValue: rec.totalValue || 0,
    transferDate: rec.transferDate ? new Date(rec.transferDate).toISOString().split('T')[0] : '—',
    expectedDeliveryDate: rec.expectedDeliveryDate ? new Date(rec.expectedDeliveryDate).toISOString().split('T')[0] : '—',
    status: rec.status || 'Pending',
    reason: rec.reason || '—',
    notes: rec.notes || '',
    initiatedBy: rec.initiatedBy?.name || rec.initiatedBy?.firstName || '—',
    initiatedById: rec.initiatedBy?._id || rec.initiatedBy,
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [transfers, itemsRes, warehousesRes] = await Promise.all([
        fetchStockTransfers(),
        fetchItems().catch(() => []),
        fetchWarehouses().catch(() => []),
      ]);
      setStockTransferData(transfers.map(mapTransfer));
      setItems(itemsRes);
      setWarehouses(warehousesRes);
    } catch (err) {
      setError(err.message || 'Failed to load stock transfers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const filteredTransfers = stockTransferData.filter(t =>
    (t.productName?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.fromWarehouse?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.toWarehouse?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.transferId?.toLowerCase() || '').includes(search.toLowerCase()) ||
    (t.status?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return "hrms-badge-success";
      case "In Transit": return "hrms-badge-warning";
      case "Pending": return "hrms-badge-neutral";
      case "Cancelled": return "hrms-badge-error";
      default: return "hrms-badge-neutral";
    }
  };

  const handleCreateTransfer = () => { setSelectedTransfer(null); setOpenData(true); };
  const handleViewTransfer = (t) => { setSelectedTransfer(t); setViewShow(true); };
  const handleEditTransfer = (t) => { setSelectedTransfer(t); setEditShow(true); };
  const handleDeleteTransfer = (t) => { setSelectedTransfer(t); setDeleteShow(true); };

  const handleSaveTransfer = async (formData) => {
    setSaving(true);
    try {
      // Build payload matching the StockTransfer schema
      const transferItems = formData.items?.map(i => ({
        itemId: i.itemId,
        quantity: Number(i.quantity),
        unit: i.unit || 'Pieces',
        batchNumber: i.batchNumber || undefined,
        costPrice: Number(i.costPrice || 0),
        totalValue: Number(i.costPrice || 0) * Number(i.quantity || 0),
      })) || [];

      const totalValue = transferItems.reduce((s, i) => s + (i.totalValue || 0), 0);

      const payload = {
        transferNumber: formData.transferNumber || `TRF-${Date.now()}`,
        fromWarehouse: formData.fromWarehouseId || formData.fromWarehouse,
        toWarehouse: formData.toWarehouseId || formData.toWarehouse,
        items: transferItems,
        totalValue,
        transferDate: formData.transferDate ? new Date(formData.transferDate).toISOString() : new Date().toISOString(),
        expectedDeliveryDate: formData.expectedDeliveryDate ? new Date(formData.expectedDeliveryDate).toISOString() : undefined,
        status: formData.status || 'Pending',
        reason: formData.reason || formData.transferReason || '',
        notes: formData.notes || '',
        initiatedBy: formData.initiatedById || formData.initiatedBy,
      };

      if (editShow && selectedTransfer) {
        await updateStockTransfer(selectedTransfer._id, payload);
      } else {
        await createStockTransfer(payload);
      }
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to save stock transfer');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteStockTransfer(selectedTransfer._id);
      handleClose();
      await loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete stock transfer');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedTransfer(null), 100);
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
          placeholder="Search stock transfers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
          sx={{ width: "300px", "& .MuiOutlinedInput-root": { height: "40px" } }}
        />
        <button className="hrms-btn hrms-btn-primary" style={{ height: "40px" }} onClick={handleCreateTransfer}>
          <Add /> Add Stock Transfer
        </button>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Transfer ID</TableCell>
                <TableCell>Product(s)</TableCell>
                <TableCell>From Warehouse</TableCell>
                <TableCell>To Warehouse</TableCell>
                <TableCell>Total Qty</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Transfer Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransfers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .length > 0
                ? filteredTransfers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((transfer, index) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                            {transfer.transferId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {transfer.productName}
                          </Typography>
                        </TableCell>
                        <TableCell>{transfer.fromWarehouse}</TableCell>
                        <TableCell>{transfer.toWarehouse}</TableCell>
                        <TableCell>{transfer.transferQuantity}</TableCell>
                        <TableCell>₹{Number(transfer.totalValue || 0).toLocaleString()}</TableCell>
                        <TableCell>{transfer.transferDate}</TableCell>
                        <TableCell>
                          <Box className={`hrms-badge ${getStatusColor(transfer.status)}`}>
                            {transfer.status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleViewTransfer(transfer)} sx={{ color: '#1976d2' }}><VisibilityOutlined /></IconButton>
                            <IconButton size="small" onClick={() => handleEditTransfer(transfer)} sx={{ color: '#000' }}><EditOutlined /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteTransfer(transfer)} sx={{ color: '#f44336' }}><DeleteOutlined /></IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                : <TableRow><TableCell colSpan={10} align="center" sx={{ py: 3 }}>No stock transfer records found</TableCell></TableRow>
              }
            </TableBody>
          </Table>
        </Box>
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {filteredTransfers.length > 0 ? page * rowsPerPage + 1 : 0} to {Math.min((page + 1) * rowsPerPage, filteredTransfers.length)} of {filteredTransfers.length} stock transfers
            </Typography>
            <Pagination
              count={Math.ceil(filteredTransfers.length / rowsPerPage) || 1}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      <CommonDialog
        key={selectedTransfer?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Stock Transfer" :
          viewShow ? "Stock Transfer Details" :
          editShow ? "Edit Stock Transfer" :
          deleteShow ? "Delete Stock Transfer" : ""
        }
        dialogContent={
          openData ? (
            <CreateStockTransfer onClose={handleClose} onSave={handleSaveTransfer} items={items} warehouses={warehouses} loading={saving} />
          ) : viewShow ? (
            <ViewStockTransfer transferData={selectedTransfer} />
          ) : editShow ? (
            <EditStockTransfer transferData={selectedTransfer} onClose={handleClose} onSave={handleSaveTransfer} items={items} warehouses={warehouses} loading={saving} />
          ) : deleteShow ? (
            <DeleteStockTransfer transferData={selectedTransfer} onClose={handleClose} onDelete={handleDeleteConfirm} loading={saving} />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default StockTransfer;