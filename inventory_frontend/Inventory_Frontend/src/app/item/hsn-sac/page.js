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
import CreateHSN from '../../../components/hsn-code/create';
import EditHSN from '../../../components/hsn-code/edit';
import ViewHSN from '../../../components/hsn-code/view';
import DeleteHSN from '../../../components/hsn-code/delete';
import {
  fetchHsnSacCodes,
  createHsnSacCode,
  updateHsnSacCode,
  deleteHsnSacCode,
  fetchCategories,
  fetchSubcategories,
} from '@/lib/itemApi';

const HSNCodeManagement = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedHSN, setSelectedHSN] = useState(null);
  const [hsnData, setHsnData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    Promise.all([fetchHsnSacCodes(), fetchCategories(), fetchSubcategories()])
      .then(([codes, cats, subs]) => {
        setHsnData(codes);
        setCategories(cats || []);
        setSubcategories(subs || []);
      })
      .catch((err) => setError(err.message || 'Failed to load HSN codes'))
      .finally(() => setLoading(false));
  }, []);

  const filteredHSN = hsnData.filter(hsn =>
    (hsn.hsnCode || '').toLowerCase().includes(search.toLowerCase()) ||
    (hsn.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (hsn.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "hrms-badge-success";
      case "Inactive": return "hrms-badge-error";
      default: return "hrms-badge-neutral";
    }
  };

  const handleCreateHSN = () => {
    setSelectedHSN(null);
    setOpenData(true);
  };

  const handleViewHSN = (hsn) => {
    setSelectedHSN(hsn);
    setViewShow(true);
  };

  const handleEditHSN = (hsn) => {
    setSelectedHSN(hsn);
    setEditShow(true);
  };

  const handleDeleteHSN = (hsn) => {
    setSelectedHSN(hsn);
    setDeleteShow(true);
  };

  const enrichHsn = (hsn) => {
    if (!hsn) return hsn;
    const cat = categories.find(c => String(c.id || c._id) === String(hsn.categoryId || hsn.category));
    const sub = subcategories.find(s => String(s.id || s._id) === String(hsn.subCategoryId || hsn.subCategory));
    return {
      ...hsn,
      category: cat?.name || cat?.categoryName || hsn.category,
      subCategory: sub?.name || sub?.subCategoryName || hsn.subCategory,
    };
  };

  const handleSaveHSN = async (formData) => {
    setError('');
    try {
      const payload = {
        ...formData,
        categoryId: formData.categoryId || formData.category,
        subCategoryId: formData.subCategoryId || formData.subCategory,
      };
      if (editShow && selectedHSN?.id) {
        const updated = await updateHsnSacCode(selectedHSN.id, payload);
        setHsnData(prev => prev.map(h => h.id === selectedHSN.id ? enrichHsn(updated) : h));
      } else {
        const created = await createHsnSacCode(payload);
        setHsnData(prev => [enrichHsn(created), ...prev]);
      }
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to save HSN code');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedHSN?.id) return;
    setError('');
    try {
      await deleteHsnSacCode(selectedHSN.id);
      setHsnData(prev => prev.filter(h => h.id !== selectedHSN.id));
      handleClose();
    } catch (err) {
      setError(err.message || 'Failed to delete HSN code');
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedHSN(null), 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search HSN codes..."
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
          onClick={handleCreateHSN}
        >
          <Add />
          Add HSN Code
        </button>
      </Box>

      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>HSN/SAC Code</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Tax Rate (%)</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subcategory</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHSN
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((hsn, index) => (
                  <TableRow key={hsn.id || hsn._id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {hsn.hsnCode || hsn.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: '300px' }}>
                        {hsn.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {hsn.taxRate}%
                      </Typography>
                    </TableCell>
                    <TableCell>{hsn.category || '-'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#000', fontWeight: 500 }}>
                        {hsn.subCategory || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(hsn.status)}`}>
                        {hsn.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton size="small" onClick={() => handleViewHSN(hsn)} sx={{ color: '#1976d2' }}>
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEditHSN(hsn)} sx={{ color: '#000' }}>
                          <EditOutlined />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteHSN(hsn)} sx={{ color: '#f44336' }}>
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredHSN.length)} of {filteredHSN.length} HSN codes
            </Typography>
            <Pagination
              count={Math.ceil(filteredHSN.length / rowsPerPage) || 1}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      <CommonDialog
        key={selectedHSN?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add HSN/SAC Code" :
          viewShow ? "HSN/SAC Code Details" :
          editShow ? "Edit HSN/SAC Code" :
          deleteShow ? "Delete HSN/SAC Code" : ""
        }
        dialogContent={
          openData ? (
            <CreateHSN
              onClose={handleClose}
              onSave={handleSaveHSN}
              categories={categories}
              subcategories={subcategories}
            />
          ) : viewShow ? (
            <ViewHSN hsnData={selectedHSN} />
          ) : editShow ? (
            <EditHSN
              hsnData={selectedHSN}
              onClose={handleClose}
              onSave={handleSaveHSN}
              categories={categories}
              subcategories={subcategories}
            />
          ) : deleteShow ? (
            <DeleteHSN
              hsnData={selectedHSN}
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

export default HSNCodeManagement;
