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
import CreateDeliveryChallan from "@/components/sales/delivery-challan/Create";
import ViewDeliveryChallan from "@/components/sales/delivery-challan/View";
import EditDeliveryChallan from "@/components/sales/delivery-challan/Edit";
import DeleteDeliveryChallan from "@/components/sales/delivery-challan/Delete";

export default function DeliveryChallan() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [createShow, setCreateShow] = useState(false);
  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  // Sample data
  const [challanData, setChallanData] = useState([
    {
      challanId: "DC001",
      challanNumber: "DC-2024-001",
      customerName: "ABC Electronics",
      productName: "Laptop Pro 15",
      address: "123 Tech Street, Mumbai, Maharashtra - 400001",
      quantity: 5,
      dispatchType: "Express",
      dispatchDate: "2024-01-15",
      status: "Dispatched"
    },
    {
      challanId: "DC002", 
      challanNumber: "DC-2024-002",
      customerName: "XYZ Corporation",
      productName: "Office Chair",
      address: "456 Business Park, Delhi, Delhi - 110001",
      quantity: 10,
      dispatchType: "Standard",
      dispatchDate: "2024-01-16",
      status: "In Transit"
    },
    {
      challanId: "DC003",
      challanNumber: "DC-2024-003", 
      customerName: "Tech Solutions Ltd",
      productName: "LED TV 43",
      address: "789 Innovation Hub, Bangalore, Karnataka - 560001",
      quantity: 3,
      dispatchType: "Express",
      dispatchDate: "2024-01-17",
      status: "Delivered"
    }
  ]);

  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = challanData.find(row => row.challanId === id);
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newChallan) => {
    const nextId = challanData.length + 1;
    const newChallanData = {
      ...newChallan,
      challanId: `DC${String(nextId).padStart(3, '0')}`
    };
    setChallanData([...challanData, newChallanData]);
    setCreateShow(false);
  };

  const handleUpdate = (updatedChallan) => {
    setChallanData(challanData.map(row => 
      row.challanId === updatedChallan.challanId 
        ? { ...updatedChallan }
        : row
    ));
  };

  const handleDelete = () => {
    setChallanData(challanData.filter(row => row.challanId !== deleteData.challanId));
    setDeleteShow(false);
    setDeleteData(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const filteredData = challanData.filter(row =>
    row.challanNumber.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase()) ||
    row.dispatchType.toLowerCase().includes(search.toLowerCase()) ||
    row.status.toLowerCase().includes(search.toLowerCase())
  );

  const currentData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "Dispatched":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "In Transit":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Delivered":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search delivery challans..."
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
          onClick={handleCreateOpen}
        >
          <Add />
          Add Delivery Challan
        </button>
      </Box>

      {/* Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>S. No.</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Challan Number</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Customer Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Address</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Dispatch Type</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Dispatch Date</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row, index) => (
                <TableRow key={row.challanId} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {row.challanNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.customerName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.productName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.address}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.quantity}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.dispatchType}
                      size="small"
                      sx={{
                        backgroundColor: row.dispatchType === 'Express' ? '#e3f2fd' : '#f3e5f5',
                        color: row.dispatchType === 'Express' ? '#1976d2' : '#7b1fa2',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.dispatchDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      sx={{
                        ...getStatusColor(row.status),
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
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
                        onClick={() => handleShowDelete(row.challanId)}
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
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredData.length)} of {filteredData.length} delivery challans
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
      </Box>

      {/* Common Dialog */}
      <CommonDialog
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Delivery Challan" :
          viewShow ? "View Delivery Challan" :
          editShow ? "Edit Delivery Challan" :
          deleteShow ? "Delete Delivery Challan" : ""
        }
        dialogContent={
          createShow ? <CreateDeliveryChallan handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewDeliveryChallan viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditDeliveryChallan editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteDeliveryChallan challanData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
}
