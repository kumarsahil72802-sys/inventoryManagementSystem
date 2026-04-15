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
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import { fetchCategories, createCategory, updateCategory, deleteCategory, categoryFromApi } from '../../../lib/itemApi';
import CommonDialog from '../../../components/CommonDialog';
import CreateCategory from '../../../components/Categories/Create';
import EditCategory from '../../../components/Categories/Edit';
import ViewCategory from '../../../components/Categories/View';
import DeleteCategory from '../../../components/Categories/Delete';

const Categories = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categoriesDataState, setCategoriesDataState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchCategories();
        if (!cancelled) setCategoriesDataState(list);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredCategories = categoriesDataState.filter(category =>
    category.categoryName.toLowerCase().includes(search.toLowerCase()) ||
    category.description.toLowerCase().includes(search.toLowerCase())
  );

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

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setOpenData(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setViewShow(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setEditShow(true);
  };

  const handleDeleteCategory = (category) => {
    setSelectedCategory(category);
    setDeleteShow(true);
  };

  const handleSaveCategory = async (categoryData) => {
    setSaving(true);
    setError(null);
    try {
      if (openData) {
        const created = await createCategory(categoryData);
        setCategoriesDataState((prev) => [categoryFromApi(created), ...prev]);
      } else if (editShow && selectedCategory?.id) {
        const updated = await updateCategory(selectedCategory.id, categoryData);
        setCategoriesDataState((prev) =>
          prev.map((c) => (c.id === selectedCategory.id ? categoryFromApi(updated) : c))
        );
      }
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setSaving(true);
    setError(null);
    try {
      await deleteCategory(id);
      setCategoriesDataState((prev) => prev.filter((c) => c.id !== id));
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to delete category");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => setSelectedCategory(null), 100);
  };

  // Get unique parent categories for dropdown
  const parentCategories = [...new Set(categoriesDataState.map(cat => cat.categoryName))];

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading categories...</Typography>
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
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search categories..."
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
          onClick={handleCreateCategory}
        >
          <Add />
          Add Category
        </button>
      </Box>

      {/* Categories Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Category Id</TableCell>
                <TableCell>Category Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((category, index) => (
                  <TableRow key={category.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {category.categoryName}
                      </Typography>
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(category.status)}`}>
                        {category.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewCategory(category)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditCategory(category)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteCategory(category)}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
            </Typography>
            <Pagination
              count={Math.ceil(filteredCategories.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* CommonDialog for all CRUD operations */}
      <CommonDialog
        key={selectedCategory?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Category" :
          viewShow ? "Category Details" :
          editShow ? "Edit Category" :
          deleteShow ? "Delete Category" : ""
        }
        dialogContent={
          openData ? (
            <CreateCategory
              onClose={handleClose}
              onSave={handleSaveCategory}
            />
          ) : viewShow ? (
            <ViewCategory
              categoryData={selectedCategory}
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
            <EditCategory
              categoryData={selectedCategory}
              onClose={handleClose}
              onSave={handleSaveCategory}
            />
          ) : deleteShow ? (
            <DeleteCategory
              categoryData={selectedCategory}
              onClose={handleClose}
              onDelete={handleDeleteConfirm}
              saving={saving}
            />
          ) : null
        }
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={!deleteShow}
      />
    </div>
  );
};

export default Categories;
