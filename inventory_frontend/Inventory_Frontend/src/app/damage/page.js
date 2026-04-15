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
  Stack,
} from "@mui/material";
import { Search, Add, VisibilityOutlined, EditOutlined, DeleteOutlined } from "@mui/icons-material";

const Damage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);

  // Damage Tracking data based on spreadsheet specifications
  const [damageData, setDamageData] = useState([
    {
      id: "DMG001",
      damageId: "DMG001",
      productName: "Samsung Galaxy S24",
      skuCode: "SGS24-128GB",
      batchNumber: "BATCH001",
      damageDate: "2024-09-20",
      damageType: "Physical Damage",
      damageReason: "Screen cracked during handling",
      damagedQuantity: 1,
      unitCost: 42000,
      totalLoss: 42000,
      reportedBy: "Priya Singh",
      approvedBy: "Ayush Kumar",
      status: "Approved",
      actionTaken: "Write-off",
      warehouseName: "Electronics Warehouse",
      location: "Shelf A-1",
      notes: "Screen completely shattered, not repairable"
    },
    {
      id: "DMG002",
      damageId: "DMG002",
      productName: "Office Chair Ergonomic",
      skuCode: "OCE-001",
      batchNumber: "BATCH003",
      damageDate: "2024-09-18",
      damageType: "Water Damage",
      damageReason: "Leak from ceiling during rain",
      damagedQuantity: 2,
      unitCost: 10000,
      totalLoss: 20000,
      reportedBy: "Nysa Mittal",
      approvedBy: "Priya Singh",
      status: "Under Review",
      actionTaken: "Pending",
      warehouseName: "Furniture Warehouse",
      location: "Section B-2",
      notes: "Fabric and foam damaged, needs assessment"
    },
    {
      id: "DMG003",
      damageId: "DMG003",
      productName: "Coffee Mug Ceramic",
      skuCode: "CMC-001",
      batchNumber: "BATCH004",
      damageDate: "2024-09-15",
      damageType: "Breakage",
      damageReason: "Dropped during loading",
      damagedQuantity: 5,
      unitCost: 120,
      totalLoss: 600,
      reportedBy: "Rajesh Kumar",
      approvedBy: "Ayush Kumar",
      status: "Approved",
      actionTaken: "Write-off",
      warehouseName: "Main Warehouse",
      location: "Loading Dock",
      notes: "Multiple pieces broken, not salvageable"
    },
    {
      id: "DMG004",
      damageId: "DMG004",
      productName: "LED TV 55 inch",
      skuCode: "LTV55-4K",
      batchNumber: "BATCH005",
      damageDate: "2024-09-12",
      damageType: "Electrical Damage",
      damageReason: "Power surge during testing",
      damagedQuantity: 1,
      unitCost: 32000,
      totalLoss: 32000,
      reportedBy: "Amit Patel",
      approvedBy: "Priya Singh",
      status: "Approved",
      actionTaken: "Return to Supplier",
      warehouseName: "Electronics Warehouse",
      location: "Testing Area",
      notes: "Motherboard fried, under warranty"
    },
    {
      id: "DMG005",
      damageId: "DMG005",
      productName: "Dell Laptop Inspiron 15",
      skuCode: "DLI15-512GB",
      batchNumber: "BATCH002",
      damageDate: "2024-09-10",
      damageType: "Physical Damage",
      damageReason: "Forklift accident",
      damagedQuantity: 1,
      unitCost: 52000,
      totalLoss: 52000,
      reportedBy: "Priya Sharma",
      approvedBy: "Ayush Kumar",
      status: "Approved",
      actionTaken: "Insurance Claim",
      warehouseName: "Electronics Warehouse",
      location: "Aisle C-3",
      notes: "Severe structural damage, insurance claim filed"
    }
  ]);

  const filteredDamages = damageData.filter(damage =>
    damage.damageId.toLowerCase().includes(search.toLowerCase()) ||
    damage.productName.toLowerCase().includes(search.toLowerCase()) ||
    damage.damageType.toLowerCase().includes(search.toLowerCase()) ||
    damage.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "hrms-badge-success";
      case "Under Review":
        return "hrms-badge-warning";
      case "Rejected":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getDamageTypeColor = (type) => {
    switch (type) {
      case "Physical Damage":
        return "hrms-badge-error";
      case "Water Damage":
        return "hrms-badge-primary";
      case "Breakage":
        return "hrms-badge-warning";
      case "Electrical Damage":
        return "hrms-badge-error";
      default:
        return "hrms-badge-neutral";
    }
  };

  const getActionTakenColor = (action) => {
    switch (action) {
      case "Write-off":
        return "hrms-badge-error";
      case "Return to Supplier":
        return "hrms-badge-primary";
      case "Insurance Claim":
        return "hrms-badge-warning";
      case "Pending":
        return "hrms-badge-neutral";
      default:
        return "hrms-badge-neutral";
    }
  };

  return (
    <div className="content-area">
      
      {/* Search and Create Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <TextField
          placeholder="Search damage reports..."
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
        >
          <Add />
          Report Damage
        </button>
      </Box>

      {/* Damage Table */}
      <Box className="hrms-card">
        <Box className="hrms-card-content" sx={{ padding: 0 }}>
          <Table className="hrms-table">
            <TableHead>
              <TableRow>
                <TableCell>S. No.</TableCell>
                <TableCell>Damage Id</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Damage Date</TableCell>
                <TableCell>Damage Type</TableCell>
                <TableCell>Total Loss</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDamages
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((damage, index) => (
                  <TableRow key={damage.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {damage.damageId}
                      </Typography>
                    </TableCell>
                    <TableCell>{damage.productName}</TableCell>
                    <TableCell>{damage.damageDate}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getDamageTypeColor(damage.damageType)}`}>
                        {damage.damageType}
                      </Box>
                    </TableCell>
                    <TableCell>₹{damage.totalLoss.toLocaleString()}</TableCell>
                    <TableCell>
                      <Box className={`hrms-badge ${getStatusColor(damage.status)}`}>
                        {damage.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: "0.25rem" }}>
                        <IconButton 
                          size="small"
                          sx={{ color: "#1976D2", fontSize: "16px" }}
                        >
                          <VisibilityOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#000", fontSize: "16px" }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton 
                          size="small"
                          sx={{ color: "#d32f2f", fontSize: "16px" }}
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

        <Box sx={{ borderTop: 1, borderColor: 'divider', backgroundColor: '#fafafa', p: 2, }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, filteredDamages.length)} of {filteredDamages.length} damage reports
            </Typography>
            <Pagination
              count={Math.ceil(filteredDamages.length / rowsPerPage)}
              page={page + 1}
              onChange={(_, newPage) => setPage(newPage - 1)}
              size="small"
              color="primary"
            />
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Damage;
