'use client';

import React, { useState } from 'react';
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
  Button,
  Chip,
  Stack,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateDamage from "@/components/Damage Tracking/Create";
import ViewDamage from "@/components/Damage Tracking/View";
import EditDamage from "@/components/Damage Tracking/Edit";
import DeleteDamage from "@/components/Damage Tracking/Delete";

const StockWriteOff = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  // Dialog states
  const [createShow, setCreateShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Damage Tracking data - simplified
  const [damageData, setDamageData] = useState([
    {
      id: "DMG001",
      damageId: "DMG001",
      productName: "Samsung Galaxy S24",
      damageDate: "2024-09-18",
      damageType: "Physical Damage",
      damagedQuantity: 2,
      unitCost: 42000,
      totalLoss: 84000,
      reportedBy: "Rajesh Kumar",
      status: "Approved",
      warehouse: "Electronics Warehouse"
    },
    {
      id: "DMG002",
      damageId: "DMG002",
      productName: "Office Chair Ergonomic",
      damageDate: "2024-09-15",
      damageType: "Water Damage",
      damagedQuantity: 1,
      unitCost: 10000,
      totalLoss: 10000,
      reportedBy: "Amit Patel",
      status: "Approved",
      warehouse: "Furniture Warehouse"
    },
    {
      id: "DMG003",
      damageId: "DMG003",
      productName: "Coffee Mug Ceramic",
      damageDate: "2024-09-20",
      damageType: "Breakage",
      damagedQuantity: 5,
      unitCost: 500,
      totalLoss: 2500,
      reportedBy: "Meera Joshi",
      status: "Pending",
      warehouse: "Main Warehouse"
    }
  ]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = damageData.find(row => row.id === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newDamage) => {
    const nextId = damageData.length + 1;
    const newDamageData = {
      ...newDamage,
      id: `DMG${String(nextId).padStart(3, '0')}`
    };
    setDamageData([...damageData, newDamageData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedDamage) => {
    setDamageData(damageData.map(row => 
      row.id === updatedDamage.id 
        ? { ...updatedDamage }
        : row
    ));
  };

  const handleDelete = () => {
    setDamageData(damageData.filter(row => row.id !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  // Filter data
  const filteredData = damageData.filter(row =>
    row.productName.toLowerCase().includes(search.toLowerCase()) ||
    row.damageType.toLowerCase().includes(search.toLowerCase()) ||
    row.status.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Pending":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Rejected":
        return { backgroundColor: "#ffebee", color: "#d32f2f" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search damage reports..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateOpen}
          sx={{ 
            backgroundColor: '#1976d2',
            '&:hover': { backgroundColor: '#1565c0' },
            transform: 'none',
            textTransform: 'none'
          }}
        >
          Report Damage
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Damage Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Damage Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Damaged Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unit Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Loss</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Reported By</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Warehouse</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.damageDate}</TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.damageType}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.damagedQuantity}</TableCell>
                <TableCell align="left">₹{row.unitCost.toLocaleString()}</TableCell>
                <TableCell align="left">₹{row.totalLoss.toLocaleString()}</TableCell>
                <TableCell align="left">{row.reportedBy}</TableCell>
                <TableCell align="left">
                  <Chip
                    label={row.status}
                    size="small"
                    sx={{
                      ...getStatusColor(row.status),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell align="left">{row.warehouse}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleView(row)}
                      sx={{ color: '#1976d2' }}
                    >
                      <VisibilityOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(row)}
                      sx={{ color: '#000' }}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleShowDelete(row.id)}
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
     
      {/* Pagination */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} damage reports
          </Typography>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            size="small"
            color="primary"
          />
        </Stack>
      </Box>
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Damage Report" :
          viewShow ? "View Damage Report" :
          editShow ? "Edit Damage Report" :
          deleteShow ? "Delete Damage Report" : ""
        }
        dialogContent={
          createShow ? <CreateDamage handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewDamage viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditDamage editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteDamage damageData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
};

export default StockWriteOff;