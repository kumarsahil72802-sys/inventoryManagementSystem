"use client";
import { useState } from "react";
import {
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Layout from "@/components/Layout";
import CommonDialog from "@/components/CommonDialog";
import CreateDamage from "@/components/Damage Tracking/Create";
import ViewDamage from "@/components/Damage Tracking/View";
import EditDamage from "@/components/Damage Tracking/Edit";
import DeleteDamage from "@/components/Damage Tracking/Delete";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DownloadReceipt from "@/components/Damage Tracking/DownloadReceipt";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DamageTable() {
  const [rows, setRows] = useState([
    createData(1,"DT001","WO101", "Laptop",2,"Screen Cracked","8 Apr 2024","Pending"),
    createData(2,"DT002","WO102", "Mobile Phone",5,"Water Damage","16 Feb 2023","Approved"),
    createData(3,"DT003","WO103", "Headphone",6,"Broken Headband","5 Dec 2023","Rejected"),
  ]);

  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  
  function createData(si, entryid, writeoffid, product, quantity, reason, date,status,receipt, ) {
    return {
      si, entryid, writeoffid, product, quantity, reason, date, status,receipt,
      action: (
        <>
          <IconButton
            style={{ color: "#072eb0", padding: "4px", transform: "scale(0.8)" }}
            onClick={() => handleView({ si, entryid, writeoffid, product, quantity, reason, date, status,receipt})}
          >
            <VisibilityIcon/>
          </IconButton>
          <IconButton
            style={{ color: "#6b6666", padding: "4px", transform: "scale(0.8)" }}
            onClick={() => handleEdit({ si, entryid, writeoffid, product, quantity, reason, date, status,receipt })}
          >
            <EditIcon/>
          </IconButton>
          <IconButton
            style={{ color: "#e6130b", padding: "4px", transform: "scale(0.8)" }}
            onClick={() => handleShowDelete(si)}
          >
            <DeleteIcon/>
          </IconButton>
        </>
      )
    };
  }

  
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { setDeleteId(id); setDeleteShow(true); };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  
  const handleCreate = (newDamage) => {
    const nextSi = rows.length + 1;
    const newRow = createData(
      nextSi,
      newDamage.entryid,
      newDamage.writeoffid,
      newDamage.product,
      newDamage.quantity,
      newDamage.reason,
      newDamage.date,
      newDamage.receipt,
      newDamage.status
    );
    setRows([...rows, newRow]);
  };

  
  const handleUpdate = (updatedDamage) => {
    setRows(rows.map(row =>
      row.si === updatedDamage.si
        ? createData(
            row.si,
            updatedDamage.entryid,
            updatedDamage.writeoffid,
            updatedDamage.product,
            updatedDamage.quantity,
            updatedDamage.reason,
            updatedDamage.date,
            updatedDamage.receipt,
            updatedDamage.status
          )
        : row
    ));
  };

  
  const handleDelete = (id) => {
    setRows(rows.filter(row => row.si !== id));
    setIsDeleting(false);
  };

  
  const filteredRows = rows.filter(row =>
    row.writeoffid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.entryid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Damage Receipt Report", 14, 20);

    const tableColumn = ["SI No.", "Entry ID", "Write Off ID", "Product", "Quantity", "Reason", "Date", "Status","Receipt"];
    const tableRows = [];

    rows.forEach((row) => {
      tableRows.push([
        row.si,
        row.entryid,
        row.writeoffid,
        row.product,
        row.quantity,
        row.reason,
        row.date,
        row.receipt,
        row.status
      ]);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });

    doc.setFontSize(10);
    doc.text("Generated on: " + new Date().toLocaleDateString(), 14, doc.internal.pageSize.height - 10);
    doc.save("Damage_Receipt.pdf");
  };

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Damage Tracking</Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginBottom: 2 }}>
          <Button className="myBtn" variant="contained" onClick={handleCreateOpen}><AddIcon /> Add Damage</Button>
          
          <TextField
            InputProps={{
              startAdornment: <SearchIcon size={20} style={{ marginLeft: 8 }} />,
            }}
            placeholder="Search Damage"
            label="Search Damage"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "white" }}>
                <TableCell sx={{ fontWeight: "600" }}>SI No.</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Entry ID</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Write Off ID</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Quantity</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Damage Report Date</TableCell>
                
                <TableCell sx={{ fontWeight: "600" }}>Status</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Receipts</TableCell>
                <TableCell sx={{ fontWeight: "600" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.si}>
                  <TableCell>{row.si}</TableCell>
                  <TableCell>{row.entryid}</TableCell>
                  <TableCell>{row.writeoffid}</TableCell>
                  <TableCell>{row.product}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.reason}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell sx={{
                    color: row.status === "Approved" ? "green" :
                          row.status === "Pending" ? "gray" : "red",
                    fontWeight: "600"
                  }}>{row.status}</TableCell>
                  <TableCell>{row.receipt}<DownloadReceipt rows={rows}/></TableCell>
                  <TableCell>{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <CommonDialog
          open={createShow || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            createShow ? "Create New Damage" :
            viewShow ? "View Damage" :
            editShow ? "Edit Damage" :
            deleteShow ? "Delete Damage" : ""
          }
          dialogContent={
            createShow ? <CreateDamage handleClose={handleClose} handleCreate={handleCreate} /> :
            viewShow ? <ViewDamage viewData={viewData} handleClose={handleClose} /> :
            editShow ? <EditDamage editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
            deleteShow ? <DeleteDamage deleteId={deleteId} isDeleting={isDeleting} handleDelete={handleDelete} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
}






/*"use client";
import { useState } from "react";
import {
  IconButton,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Box
} from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Layout from "@/components/Layout";
import CommonDialog from "@/components/CommonDialog";
import CreateDamage from "@/components/Damage Tracking/Create";
import ViewDamage from "@/components/Damage Tracking/View";
import EditDamage from "@/components/Damage Tracking/Edit";
import DeleteDamage from "@/components/Damage Tracking/Delete";
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';

export default function DamageTable() {
  const [rows, setRows] = useState([
    createData(1,"DT001","WO101", "Laptop",2,"Screen Cracked","8 Apr 2024","Pending"),
    createData(2,"DT002","WO102", "Mobile Phone",5,"Water Damage","16 Feb 2023","Approved"),
    createData(3,"DT003","WO103", "Headphone",6,"Broken Headband","5 Dec 2023","Rejected"),
  ]);

  const [viewShow, setViewShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);

  const [viewData, setViewData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  
  function createData(si, entryid, writeoffid, product, quantity, reason, date, status) {
    return {
      si, entryid, writeoffid, product, quantity, reason, date, status,
      action: (
        <>
          <IconButton style={{ color: "#072eb0", padding: "4px", transform: "scale(0.8)" }} onClick={() => handleView({ si, entryid, writeoffid, product, quantity, reason, date, status})}><VisibilityIcon/></IconButton>
          <IconButton style={{ color: "#6b6666", padding: "4px", transform: "scale(0.8)" }} onClick={() => handleEdit({ si, entryid, writeoffid, product, quantity, reason, date, status })}><EditIcon/></IconButton>
          <IconButton style={{ color: "#e6130b", padding: "4px", transform: "scale(0.8)" }} onClick={() => handleShowDelete(id)}><DeleteIcon/></IconButton>
        </>
      )
    };
  }

  
  const handleView = (row) => { setViewData(row); setViewShow(true); };
  const handleEdit = (row) => { setEditData(row); setEditShow(true); };
  const handleShowDelete = (id) => { setDeleteId(id); setDeleteShow(true); };
  const handleCreateOpen = () => setCreateShow(true);
  const handleClose = () => { setViewShow(false); setEditShow(false); setDeleteShow(false); setCreateShow(false); };

  
  const handleCreate = (newDamage) => {
    const nextSi = rows.length + 1;
    const newRow = createData(
      nextSi,
      newDamage.entryidid,
      newDamage.writeoffid,
      newDamage.product,
      newDamage.quantity,
      newDamage.reason,
      newDamage.date,
      
      newDamage.status
    );
    setRows([...rows, newRow]);
  };

  
  const handleUpdate = (updatedDamage) => {
    setRows(rows.map(row =>
      row.si === updatedDamage.si
        ? createData(
            row.si,
            updatedDamage.entryidid,
            updatedDamage.writeoffid,
            updatedDamage.product,
            updatedDamage.quantity,
            updatedDamage.reason,
            updatedDamage,
            updatedDamage.status
            
          )
        : row
    ));
  };


  const handleDelete = (id) => {
    setRows(rows.filter(row => row.id !== id));
    setIsDeleting(false);
  };

  
  const filteredRows = rows.filter(row =>
    row.writeoffid.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.entryid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <Box sx={{ padding: "20px" }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>Damage Tracking</Typography>

        
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, marginBottom: 2 }}>
          <Button  className="myBtn" variant="contained"  onClick={handleCreateOpen}> <AddIcon></AddIcon>Add Damage</Button>
          <Button  className="Btn" variant="contained"  onClick={handleCreateOpen}><DownloadIcon></DownloadIcon> Download Receipt</Button>
          
          
          <TextField
            InputProps={{
                          startAdornment: <SearchIcon size={20} style={{ marginLeft: 8 }} />,
                        }}
            placeholder="Search Damage"
            className="seachBar"
            label="Search Damage"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            
          />
        </Box>

        
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "white" }}>
                <TableCell sx={{ fontWeight: "600" }}>SI No.</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Entry ID</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Write Off ID</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Product</TableCell>
                 <TableCell sx={{ fontWeight: "600" }} align="left">Quantity</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Reason</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Damage Report Date</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Status</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="left">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.si}>
                  <TableCell>{row.si}</TableCell>
                  <TableCell align="left">{row.entryid}</TableCell>
                  <TableCell align="left">{row.writeoffid}</TableCell>
                  <TableCell align="left">{row.product}</TableCell>
                  <TableCell align="left">{row.quantity}</TableCell>
                  <TableCell align="left">{row.reason}</TableCell>
                  <TableCell align="left">{row.date}</TableCell>
                  <TableCell align="left" 
                   sx={{ color: row.status === "Approved" 
                    ? "green" 
                    :row.status ==="Pending"
                    ? "gray"
                    : "red", fontWeight: "600" }}>{row.status}</TableCell>
                  <TableCell align="left">{row.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        
        <CommonDialog
          open={createShow || viewShow || editShow || deleteShow}
          onClose={handleClose}
          dialogTitle={
            createShow ? "Create New Damage" :
            viewShow ? "View Damage" :
            editShow ? "Edit Damage" :
            deleteShow ? "Delete Damage" : ""
          }
          dialogContent={
            createShow ? <CreateDamage handleClose={handleClose} handleCreate={handleCreate} /> :
            viewShow ? <ViewDamage viewData={viewData} handleClose={handleClose} /> :
            editShow ? <EditDamage editData={editData} handleUpdate={handleUpdate} handleClose={handleClose} /> :
            deleteShow ? <DeleteDamage deleteId={deleteId} isDeleting={isDeleting} handleDelete={handleDelete} handleClose={handleClose} /> : null
          }
        />
      </Box>
    </Layout>
  );
}*/
