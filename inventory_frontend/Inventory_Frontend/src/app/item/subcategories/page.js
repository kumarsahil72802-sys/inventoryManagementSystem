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
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Pagination,
  Stack,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { 
  fetchSubcategories, 
  fetchCategories, 
  createSubcategory, 
  updateSubcategory, 
  deleteSubcategory,
  subcategoryFromApi,
  categoryFromApi
} from '../../../lib/itemApi';
import CommonDialog from '../../../components/CommonDialog';
import CreateSubcategory from '../../../components/Subcategories/Create';
import EditSubcategory from '../../../components/Subcategories/Edit';
import ViewSubcategory from '../../../components/Subcategories/View';
import DeleteSubcategory from '../../../components/Subcategories/Delete';

const Subcategories = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [subcategoriesDataState, setSubcategoriesDataState] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [subs, cats] = await Promise.all([fetchSubcategories(), fetchCategories()]);
        if (!cancelled) {
          setSubcategoriesDataState(subs);
          setCategories(cats);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredSubcategories = subcategoriesDataState.filter(subcategory => {
    const category = categories.find(cat => cat.id === subcategory.categoryId);
    return (
      subcategory.subCategoryName.toLowerCase().includes(search.toLowerCase()) ||
      subcategory.description.toLowerCase().includes(search.toLowerCase()) ||
      (category && category.categoryName.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? (category.categoryName || category.name) : 'Unknown';
  };

  const handleCreateSubcategory = () => {
    setSelectedSubcategory(null);
    setOpenData(true);
  };

  const handleViewSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setViewShow(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setEditShow(true);
  };

  const handleDeleteSubcategory = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setDeleteShow(true);
  };

  const handleSaveSubcategory = async (subcategoryData) => {
    setSaving(true);
    setError(null);
    try {
      if (openData) {
        const created = await createSubcategory(subcategoryData);
        setSubcategoriesDataState((prev) => [subcategoryFromApi(created), ...prev]);
      } else if (editShow && selectedSubcategory?.id) {
        const updated = await updateSubcategory(selectedSubcategory.id, subcategoryData);
        setSubcategoriesDataState((prev) =>
          prev.map((s) => (s.id === selectedSubcategory.id ? subcategoryFromApi(updated) : s))
        );
      }
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to save subcategory");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setSaving(true);
    setError(null);
    try {
      await deleteSubcategory(id);
      setSubcategoriesDataState((prev) => prev.filter((s) => s.id !== id));
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to delete subcategory");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedSubcategory(null), 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading subcategories...</Typography>
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Box sx={{ mb: 2, p: 1.5, bgcolor: "error.light", color: "error.contrastText", borderRadius: 1 }}>
          {error}
        </Box>
      )}
      {/* Search and Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search subcategories..."
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
          onClick={handleCreateSubcategory}
        >
          <Add />
          Add Subcategory
        </button>
      </Box>

      {/* Subcategories Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Subcategory Id</TableCell>
                <TableCell>Subcategory Name</TableCell>
                <TableCell>Parent Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubcategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((subcategory, index) => (
                  <TableRow key={subcategory.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{subcategory.id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {subcategory.subCategoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 500 }}>
                        {getCategoryName(subcategory.categoryId)}
                      </Typography>
                    </TableCell>
                    <TableCell>{subcategory.description}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(subcategory.status)}`}>
                        {subcategory.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewSubcategory(subcategory)}
                          sx={{ color: '#1976d2' }}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditSubcategory(subcategory)}
                          sx={{ color: '#ff9800' }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSubcategory(subcategory)}
                          sx={{ color: '#f44336' }}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredSubcategories.length)} of {filteredSubcategories.length} subcategories
            </Typography>
            <Pagination
              count={Math.ceil(filteredSubcategories.length / rowsPerPage)}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* CommonDialog for all CRUD operations */}
      <CommonDialog
        key={selectedSubcategory?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Subcategory" :
          viewShow ? "Subcategory Details" :
          editShow ? "Edit Subcategory" :
          deleteShow ? "Delete Subcategory" : ""
        }
        dialogContent={
          openData ? (
            <CreateSubcategory
              onClose={handleClose}
              onSave={handleSaveSubcategory}
              categories={categories}
            />
          ) : viewShow ? (
            <ViewSubcategory
              subcategoryData={selectedSubcategory}
              onClose={handleClose}
              onEdit={() => {
                setViewShow(false);
                setEditShow(true);
              }}
              onDelete={() => {
                setViewShow(false);
                setDeleteShow(true);
              }}
            />
          ) : editShow ? (
            <EditSubcategory
              subcategoryData={selectedSubcategory}
              onClose={handleClose}
              onSave={handleSaveSubcategory}
              categories={categories}
            />
          ) : deleteShow ? (
            <DeleteSubcategory
              subcategoryData={selectedSubcategory}
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

export default Subcategories;
