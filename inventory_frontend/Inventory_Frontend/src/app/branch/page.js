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
import CommonDialog from '../../components/CommonDialog';
import CreateBranch from '../../components/branch/Create';
import EditBranch from '../../components/branch/Edit';
import ViewBranch from '../../components/branch/View';
import DeleteBranch from '../../components/branch/Delete';
import { fetchBranches, createBranch, updateBranch, deleteBranch, branchFromApi } from '../../lib/branchApi';

const Branch = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [openData, setOpenData] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchBranches();
        if (!cancelled) setBranchData(list);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load branches");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filteredBranches = branchData.filter(branch =>
    branch.branchName.toLowerCase().includes(search.toLowerCase()) ||
    branch.branchCode.toLowerCase().includes(search.toLowerCase()) ||
    branch.city.toLowerCase().includes(search.toLowerCase()) ||
    branch.managerName.toLowerCase().includes(search.toLowerCase()) ||
    branch.phone.includes(search)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "hrms-badge-success";
      case "Inactive":
        return "hrms-badge-error";
      case "Under Maintenance":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getBranchTypeColor = (type) => {
    switch (type) {
      case "Head Office":
        return "hrms-badge-primary";
      case "Regional Office":
        return "hrms-badge-success";
      case "Branch":
        return "hrms-badge-neutral";
      case "Warehouse":
        return "hrms-badge-warning";
      default:
        return "hrms-badge-neutral";
    }
  };

  const handleCreateBranch = () => {
    setSelectedBranch(null);
    setOpenData(true);
  };

  const handleViewBranch = (branch) => {
    setSelectedBranch(branch);
    setViewShow(true);
  };

  const handleEditBranch = (branch) => {
    setSelectedBranch(branch);
    setEditShow(true);
  };

  const handleDeleteBranch = (branch) => {
    setSelectedBranch(branch);
    setDeleteShow(true);
  };

  const handleSaveBranch = async (formData) => {
    setSaving(true);
    setError(null);
    try {
      if (editShow && selectedBranch?.id) {
        const updated = await updateBranch(selectedBranch.id, formData);
        setBranchData((prev) =>
          prev.map((b) => (b.id === selectedBranch.id ? branchFromApi(updated) : b))
        );
      } else {
        const created = await createBranch(formData);
        setBranchData((prev) => [branchFromApi(created), ...prev]);
      }
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBranch?.id) return;
    setSaving(true);
    setError(null);
    try {
      await deleteBranch(selectedBranch.id);
      setBranchData((prev) => prev.filter((b) => b.id !== selectedBranch.id));
      handleClose();
    } catch (e) {
      setError(e.message || "Failed to delete branch");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setOpenData(false);
    setViewShow(false);
    setEditShow(false);
    setDeleteShow(false);
    setTimeout(() => {
      setSelectedBranch(null);
    }, 100);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  if (loading) {
    return (
      <div className="content-area">
        <Typography color="text.secondary">Loading branches...</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', mb: 3 }}>
        <TextField
          placeholder="Search branches..."
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
          onClick={handleCreateBranch}
        >
          <Add />
          Add Branch
        </button>
      </Box>

      {/* Branch Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Branch Code</TableCell>
                <TableCell>Branch Name</TableCell>
                <TableCell>Branch Type</TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Employee Count</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBranches
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {branch.branchCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {branch.branchName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getBranchTypeColor(branch.branchType)}`}>
                        {branch.branchType}
                      </Box>
                    </TableCell>
                    <TableCell>{branch.managerName}</TableCell>
                    <TableCell>{branch.phone}</TableCell>
                    <TableCell>{branch.city}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {branch.employeeCount || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(branch.status)}`}>
                        {branch.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleViewBranch(branch)}
                          sx={{ color: '#1976d2' }}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditBranch(branch)}
                          sx={{ color: '#000' }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteBranch(branch)}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredBranches.length)} of {filteredBranches.length} branches
            </Typography>
            <Pagination
              count={Math.ceil(filteredBranches.length / rowsPerPage)}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Stack>
        </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        key={selectedBranch?.id || 'create'}
        open={openData || viewShow || editShow || deleteShow}
        onClose={handleClose}
        dialogTitle={
          openData ? "Add Branch" :
          viewShow ? "Branch Details" :
          editShow ? "Edit Branch" :
          deleteShow ? "Delete Branch" : ""
        }
        dialogContent={
          openData ? (
            <CreateBranch
              onClose={handleClose}
              onSave={handleSaveBranch}
              saving={saving}
            />
          ) : viewShow ? (
            <ViewBranch
              branchData={selectedBranch}
            />
          ) : editShow ? (
            <EditBranch
              branchData={selectedBranch}
              onClose={handleClose}
              onSave={handleSaveBranch}
              saving={saving}
            />
          ) : deleteShow ? (
            <DeleteBranch
              branchData={selectedBranch}
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

export default Branch;