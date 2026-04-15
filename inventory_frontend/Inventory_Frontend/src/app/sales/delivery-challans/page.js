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
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";
import CommonDialog from "@/components/CommonDialog";
import CreateDeliveryChallan from "@/components/sales/delivery-challan/Create";
import ViewDeliveryChallan from "@/components/sales/delivery-challan/View";
import EditDeliveryChallan from "@/components/sales/delivery-challan/Edit";
import DeleteDeliveryChallan from "@/components/sales/delivery-challan/Delete";

const DeliveryChallans = () => {
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

  // Delivery Challans data - simplified
  const [challanData, setChallanData] = useState([
    {
      id: "DC001",
      challanId: "DC001",
      orderId: "SO001",
      customerName: "ABC Electronics",
      productName: "Samsung Galaxy S24",
      quantity: "2",
      deliveryDate: "2024-09-25",
      deliveryAddress: "123 Main St, Mumbai, Maharashtra 400001",
      dispatchType: "Express"
    },
    {
      id: "DC002",
      challanId: "DC002",
      orderId: "SO002",
      customerName: "XYZ Furniture",
      productName: "Office Chair",
      quantity: "1",
      deliveryDate: "2024-09-22",
      deliveryAddress: "456 Park Ave, Delhi, Delhi 110001",
      dispatchType: "Standard"
    },
    {
      id: "DC003",
      challanId: "DC003",
      orderId: "SO003",
      customerName: "Tech Solutions",
      productName: "LED TV 43",
      quantity: "1",
      deliveryDate: "2024-09-28",
      deliveryAddress: "789 Tech Park, Bangalore, Karnataka 560001",
      dispatchType: "Scheduled"
    }
  ]);

  // Handlers
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = challanData.find(row => row.challanId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newChallan) => {
    const nextId = challanData.length + 1;
    const newChallanData = {
      ...newChallan,
      id: `DC${String(nextId).padStart(3, '0')}`,
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
    setChallanData(challanData.filter(row => row.challanId !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  // Filter data
  const filteredData = challanData.filter(row =>
    row.challanId.toLowerCase().includes(search.toLowerCase()) ||
    row.orderId.toLowerCase().includes(search.toLowerCase()) ||
    row.customerName.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase())
  );

  const currentPageData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const getDispatchTypeColor = (type) => {
    switch (type) {
      case "Express":
        return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
      case "Standard":
        return { backgroundColor: "#e3f2fd", color: "#1976d2" };
      case "Same Day":
        return { backgroundColor: "#fff3e0", color: "#f57c00" };
      case "Scheduled":
        return { backgroundColor: "#f3e5f5", color: "#7b1fa2" };
      default:
        return { backgroundColor: "#f5f5f5", color: "#666" };
    }
  };

  return (
    <div className="content-area">
      {/* Header with Search and Create Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search delivery challans..."
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
          Add Delivery Challan
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>SI</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Challan ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Delivery Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Dispatch Type</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((row, index) => (
              <TableRow key={row.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    {row.challanId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.orderId}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.customerName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.productName}
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {row.quantity}
                  </Typography>
                </TableCell>
                <TableCell align="left">{row.deliveryDate}</TableCell>
                <TableCell align="left">
                  <Chip
                    label={row.dispatchType}
                    size="small"
                    sx={{
                      ...getDispatchTypeColor(row.dispatchType),
                      fontWeight: 500
                    }}
                  />
                </TableCell>
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
      </Box>

      {/* Pagination */}
      {filteredData.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

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
};

export default DeliveryChallans;