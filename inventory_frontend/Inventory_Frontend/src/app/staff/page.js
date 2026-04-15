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
  CircularProgress,
  Alert,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import DeleteStaff from "@/components/staff/Delete";
import { useRouter } from "next/navigation";
import { fetchStaffList, deleteStaff } from "@/lib/staffApi";

const Staff = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [deleteShow, setDeleteShow] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

  const loadStaff = async (pageNum = page) => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchStaffList(pageNum, rowsPerPage);
      setStaffData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [page]);


  const filteredStaff = (staffData || []).filter(staff =>
    staff.staffName.toLowerCase().includes(search.toLowerCase()) ||
    staff.emailId.toLowerCase().includes(search.toLowerCase()) ||
    staff.department.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "hrms-badge-success";
      case "OnLeave":
        return "hrms-badge-warning";
      case "Unavailable":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const handleCreateStaff = () => {
    router.push('/staff/create');
  };

  const handleViewStaff = (staff) => {
    router.push(`/staff/view/${staff.id || staff._id}`);
  };

  const handleEditStaff = (staff) => {
    router.push(`/staff/edit/${staff.id || staff._id}`);
  };

  const handleDeleteStaff = (staff) => {
    setSelectedStaff(staff);
    setDeleteShow(true);
  };

  const handleDelete = async () => {
    if (!selectedStaff?.id && !selectedStaff?._id) return;
    const id = selectedStaff.id || selectedStaff._id;
    try {
      await deleteStaff(id);
      setStaffData(prev => prev.filter(staff => (staff.id || staff._id) !== id));
      setDeleteShow(false);
      setSelectedStaff(null);
    } catch (err) {
      setError(err.message || 'Failed to delete staff');
    }
  };

  const handleClose = () => {
    setDeleteShow(false);
    setSelectedStaff(null);
  };

  if (loading) {
    return (
      <div className="content-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search staff..."
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
          onClick={handleCreateStaff}
        >
          <Add />
          Add Staff
        </button>
      </Box>

      {/* Staff Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Staff Name</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Mobile No.</TableCell>
                <TableCell>Email Id</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Availability Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((staff, index) => (
                  <TableRow key={staff.id || staff._id}>
                    <TableCell>{(pagination.currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {staff.staffName}
                      </Typography>
                    </TableCell>
                    <TableCell>{staff.designation || staff.department}</TableCell>
                    <TableCell>{staff.mobileNo}</TableCell>
                    <TableCell>{staff.emailId}</TableCell>
                    <TableCell>{staff.address || staff.branchLocation || '-'}</TableCell>
                    <TableCell>₹{staff.salary || 45000}</TableCell>
                    <TableCell>{staff.joiningDate}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(staff.availabilityStatus)}`}>
                        {staff.availabilityStatus}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                          onClick={() => handleViewStaff(staff)}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                          onClick={() => handleEditStaff(staff)}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
                          onClick={() => handleDeleteStaff(staff)}
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
              Showing {pagination.totalItems > 0 ? (pagination.currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(pagination.currentPage * rowsPerPage, pagination.totalItems)} of {pagination.totalItems} staff
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

      {/* Common Dialog for Delete */}
      <CommonDialog
        open={deleteShow}
        onClose={handleClose}
        dialogTitle="Delete Staff"
        dialogContent={
          <DeleteStaff 
            selectedStaff={selectedStaff} 
            handleDelete={handleDelete} 
            handleClose={handleClose} 
          />
        }
        maxWidth="xs"
        fullWidth={false}
      />
    </div>
  );
};

export default Staff;
