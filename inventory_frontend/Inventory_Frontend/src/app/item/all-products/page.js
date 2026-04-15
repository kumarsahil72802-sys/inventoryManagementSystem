'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { fetchItems, deleteItem } from "../../../lib/itemApi";

const AllProducts = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const loadProducts = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchItems(pageNum, rowsPerPage);
      setProductsData(result.data);
      setPagination(result.pagination);
    } catch (e) {
      setError(e.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  const handleDelete = async (product) => {
    if (!product?.id || !confirm(`Delete product ${product.productName || product.description}?`)) return;
    setDeletingId(product.id);
    setError(null);
    try {
      await deleteItem(product.id);
      setProductsData((prev) => prev.filter((p) => p.id !== product.id));
    } catch (e) {
      setError(e.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = productsData.filter(product => {
    if (!search) return true;
    const s = search.toLowerCase();
    const sku = (product.skuCode || "").toLowerCase();
    const pt = (product.productType || product.type || "").toLowerCase();
    const cat = (product.categoryName || "").toLowerCase();
    const brand = (product.brandName || product.brand || "").toLowerCase();
    const wh = (product.warehouseName || "").toLowerCase();
    const st = (product.status || "").toLowerCase();
    const desc = (product.description || "").toLowerCase();
    const pn = (product.productName || "").toLowerCase();
    return sku.includes(s) || pt.includes(s) || cat.includes(s) || brand.includes(s) || wh.includes(s) || st.includes(s) || desc.includes(s) || pn.includes(s);
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
        return "hrms-badge-error";
      case "Discontinued":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getProductTypeColor = (type) => {
    switch (type) {
      case "Electronics":
        return "hrms-badge-primary";
      case "Furniture":
        return "hrms-badge-success";
      case "Kitchenware":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading products...</Typography>
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
          placeholder="Search products..."
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
          onClick={() => router.push('/item/all-products/create')}
        >
          <Add />
          Add Product
        </button>
      </Box>

      {/* Products Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Purchase Price</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsData.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell>{(pagination.currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {product.productName || product.description}
                        </Typography>
                      </TableCell>
                    <TableCell>{product.categoryName || product.category?.name}</TableCell>
                    <TableCell>{product.brandName || product.brand}</TableCell>
                    <TableCell>₹{Number(product.purchasePrice || 0).toLocaleString()}</TableCell>
                    <TableCell>₹{Number(product.sellingPrice || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(product.status)}`}>
                        {product.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => router.push(`/item/all-products/view/${product.id}`)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => router.push(`/item/all-products/edit/${product.id}`)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
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
              Showing {pagination.totalItems > 0 ? (pagination.currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(pagination.currentPage * rowsPerPage, pagination.totalItems)} of {pagination.totalItems} products
            </Typography>
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default AllProducts;
