"use client";
import { useState } from "react";
import {
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Box,
  InputAdornment,
  Pagination,
  Stack
} from '@mui/material';
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import CommonDialog from "@/components/CommonDialog";
import CreateCostTracking from "@/components/Purchase Management/Cost Tracking/Create";
import ViewCostTracking from "@/components/Purchase Management/Cost Tracking/View";
import EditCostTracking from "@/components/Purchase Management/Cost Tracking/Edit";
import DeleteCostTracking from "@/components/Purchase Management/Cost Tracking/Delete";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

export default function CostTrackingTable() {
  const [rows, setRows] = useState([
    createData(1, "CT001", "2024-01-15", "ABC Suppliers", "Laptop Pro 15", 50000, 48000, "Decreased"),
    createData(2, "CT002", "2024-01-16", "XYZ Electronics", "Office Chair", 3000, 3200, "Increased"),
    createData(3, "CT003", "2024-01-17", "Tech Solutions", "LED TV 43", 22000, 21000, "Decreased"),
  ]);

  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  function createData(si, trackingId, date, supplierName, productName, oldPrice, newPrice, changeType) {
    return {
      si, trackingId, date, supplierName, productName, oldPrice, newPrice, changeType,
      action: null
    };
  }

  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = rows.find(row => row.trackingId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = (newTracking) => {
    const nextSi = rows.length + 1;
    const newRow = createData(
      nextSi,
      newTracking.trackingId,
      newTracking.date,
      newTracking.supplierName,
      newTracking.productName,
      newTracking.oldPrice,
      newTracking.newPrice,
      newTracking.changeType
    );
    setRows([...rows, newRow]);
  };

  const handleUpdate = (updatedTracking) => {
    setRows(rows.map(row =>
      row.si === updatedTracking.si
        ? createData(
            row.si,
            updatedTracking.trackingId,
            updatedTracking.date,
            updatedTracking.supplierName,
            updatedTracking.productName,
            updatedTracking.oldPrice,
            updatedTracking.newPrice,
            updatedTracking.changeType
          )
        : row
    ));
  };

  const handleDelete = () => {
    setRows(rows.filter(row => row.trackingId !== deleteId));
    setDeleteShow(false);
    setDeleteData(null);
    setDeleteId(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const filteredRows = rows.filter(row =>
    row.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="content-area">
      {/* Search and Create Button - Single Line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* Left side - empty for now */}
        <Box></Box>

        {/* Search and Create Button - Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            placeholder="Search Cost Tracking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
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
            <AddIcon />
            Add Cost Tracking
          </button>
        </Box>
      </Box>

      {/* Table Card */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: "600", color: "#333" }}>S. No.</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Tracking ID</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Product Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Supplier Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Old Price</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">New Price</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Change Type</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Date</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.si} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{row.si}</TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {row.trackingId}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.productName}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.supplierName}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">₹{row.oldPrice.toLocaleString()}</TableCell>
                  <TableCell align="left">₹{row.newPrice.toLocaleString()}</TableCell>
                  <TableCell align="left">
                    <Box className={`hrms-badge ${row.changeType === "Increased" ? "hrms-badge-error" : "hrms-badge-success"}`}>
                      {row.changeType}
                    </Box>
                  </TableCell>
                  <TableCell align="left">{row.date}</TableCell>
                  <TableCell align="left">
                    <Box sx={{ display: 'flex', gap: 1 }}>
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
                        onClick={() => handleShowDelete(row.trackingId)}
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
        <Box sx={{ padding: "0.75rem 1rem", borderTop: "1px solid #e5e5e5", backgroundColor: "#fafafa" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: "#333", fontWeight: 500, fontSize: "0.875rem" }}>
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} cost tracking records
            </Typography>
            <Pagination
              count={Math.ceil(filteredRows.length / rowsPerPage)}
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
        open={createShow || viewShow || editShow || deleteShow}
        onClose={handleClose}
        maxWidth={deleteShow ? "sm" : "md"}
        fullWidth={deleteShow ? false : true}
        dialogTitle={
          createShow ? "Create New Cost Tracking" :
          viewShow ? "View Cost Tracking" :
          editShow ? "Edit Cost Tracking" :
          deleteShow ? "Delete Cost Tracking" : ""
        }
        dialogContent={
          createShow ? <CreateCostTracking handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewCostTracking viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditCostTracking editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeleteCostTracking trackingData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
}