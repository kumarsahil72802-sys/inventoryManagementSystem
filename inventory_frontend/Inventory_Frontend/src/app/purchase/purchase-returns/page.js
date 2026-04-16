"use client";
import { useState, useEffect } from "react";
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
import CreatePurchaseReturn from "@/components/purchase-management/Purchase Returns/Create";
import ViewPurchaseReturn from "@/components/purchase-management/Purchase Returns/View";
import EditPurchaseReturn from "@/components/purchase-management/Purchase Returns/Edit";
import DeletePurchaseReturn from "@/components/purchase-management/Purchase Returns/Delete";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAllPurchaseReturns, createPurchaseReturn, updatePurchaseReturn, deletePurchaseReturn } from '@/lib/purchaseApi';
import { CircularProgress, Alert } from '@mui/material';

export default function PurchaseReturnsTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch purchase returns on component mount
  useEffect(() => {
    const fetchPurchaseReturns = async () => {
      try {
        setLoading(true);
        const response = await getAllPurchaseReturns();
        const fetchedData = Array.isArray(response?.data) ? response.data :
                           (Array.isArray(response) ? response : []);
        setRows(fetchedData.map((returnItem, index) => ({
          ...returnItem,
          si: index + 1
        })));
        setError(null);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to fetch purchase returns');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseReturns();
  }, []);

  function createData(si, returnId, returnDate, supplierName, productName, quantity, totalAmount, status) {
    return {
      si, returnId, returnDate, supplierName, productName, quantity, totalAmount, status,
      action: null
    };
  }

  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { 
    const rowData = rows.find(row => row.returnId === id);
    setDeleteId(id); 
    setDeleteData(rowData);
    setDeleteShow(true); 
  };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  const handleCreate = async (newReturn) => {
    try {
      await createPurchaseReturn(newReturn);
      
      // Refresh the purchase returns list
      const response = await getAllPurchaseReturns();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setRows(fetchedData.map((returnItem, index) => ({
        ...returnItem,
        si: index + 1
      })));
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create purchase return');
    }
  };

  const handleUpdate = async (updatedReturn) => {
    try {
      await updatePurchaseReturn(updatedReturn._id || updatedReturn.id, updatedReturn);
      
      // Refresh the purchase returns list
      const response = await getAllPurchaseReturns();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setRows(fetchedData.map((returnItem, index) => ({
        ...returnItem,
        si: index + 1
      })));
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update purchase return');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePurchaseReturn(deleteData._id || deleteData.id);
      
      // Refresh the purchase returns list
      const response = await getAllPurchaseReturns();
      const fetchedData = Array.isArray(response?.data) ? response.data :
                         (Array.isArray(response) ? response : []);
      setRows(fetchedData.map((returnItem, index) => ({
        ...returnItem,
        si: index + 1
      })));
      handleClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete purchase return');
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1);
  };

  const filteredRows = rows.filter(row =>
    row.returnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentData = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="content-area">
      {/* Search and Create Button - Single Line */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* Left side - empty for now */}
        <Box></Box>

        {/* Search and Create Button - Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <TextField
            placeholder="Search Purchase Returns..."
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
            Add Purchase Return
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
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Return ID</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Product Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Quantity</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Return Date</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Supplier Name</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Total Amount</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Status</TableCell>
                <TableCell sx={{ fontWeight: "600", color: "#333" }} align="left">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.si} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{row.si}</TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1976d2' }}>
                      {row.returnId}
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
                  <TableCell align="left">{row.returnDate}</TableCell>
                  <TableCell align="left">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {row.supplierName}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">₹{row.totalAmount.toLocaleString()}</TableCell>
                  <TableCell align="left">
                    <Box className={`hrms-badge ${row.status === "Processed" ? "hrms-badge-success" : row.status === "Pending" ? "hrms-badge-warning" : "hrms-badge-info"}`}>
                      {row.status}
                    </Box>
                  </TableCell>
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
                        onClick={() => handleShowDelete(row.returnId)}
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
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredRows.length)} of {filteredRows.length} purchase returns
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
          createShow ? "Create New Purchase Return" :
          viewShow ? "View Purchase Return" :
          editShow ? "Edit Purchase Return" :
          deleteShow ? "Delete Purchase Return" : ""
        }
        dialogContent={
          createShow ? <CreatePurchaseReturn handleClose={handleClose} handleCreate={handleCreate} /> :
          viewShow ? <ViewPurchaseReturn viewData={viewData} handleClose={handleClose} /> :
          editShow ? <EditPurchaseReturn editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
          deleteShow ? <DeletePurchaseReturn returnData={deleteData} onClose={handleClose} onDelete={handleDelete} /> : null
        }
      />
    </div>
  );
}
