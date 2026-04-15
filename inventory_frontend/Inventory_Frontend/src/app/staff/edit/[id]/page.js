'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { fetchStaffById, updateStaff, fetchWarehouses } from "@/lib/staffApi";
import { fetchRoles } from "@/lib/rolesApi";
import { getApiUrl } from "@/lib/api";

const DEPARTMENTS = ['Warehouse', 'Sales', 'Purchase', 'Finance', 'IT', 'HR', 'Administration', 'Support', 'Maintenance', 'Security', 'Housekeeping'];

const DocumentUpload = ({ label, value, onChange, fieldName }) => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [modalContentUrl, setModalContentUrl] = useState(null);

  useEffect(() => {
    if (value && typeof value === 'string') {
      const name = value.split('/').pop() || value;
      setFileName(name);
      const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/i);
      const isUrlOrPath = value.startsWith('http') || value.startsWith('/') || value.startsWith('data:');
      if (isImage && isUrlOrPath) {
        setPreview(value);
      } else {
        setPreview(null);
      }
    } else if (value === null || value === '') {
      setPreview(null);
      setFileName('');
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(file);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileName('');
    onChange(null);
  };

  const handleView = () => {
    if (preview) {
      setModalContentUrl({ type: 'image', url: preview });
      setViewModalOpen(true);
    } else if (value && typeof value === 'string') {
      const isUrlOrPath = value.startsWith('http') || value.startsWith('/') || value.startsWith('data:');
      const name = (value.split('/').pop() || value).toLowerCase();
      const isPdf = name.endsWith('.pdf');
      const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/);
      if (isUrlOrPath && (isPdf || isImage)) {
        setModalContentUrl({ type: isPdf ? 'pdf' : 'image', url: value });
        setViewModalOpen(true);
      } else {
        setModalContentUrl({ type: 'filename', url: null, name: value.split('/').pop() || value });
        setViewModalOpen(true);
      }
    } else if (value && typeof value === 'object' && value instanceof File) {
      if (value.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setModalContentUrl({ type: 'image', url: reader.result });
          setViewModalOpen(true);
        };
        reader.readAsDataURL(value);
      } else if (value.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setModalContentUrl({ type: 'pdf', url: reader.result });
          setViewModalOpen(true);
        };
        reader.readAsDataURL(value);
      } else {
        setModalContentUrl({ type: 'filename', url: null, name: value.name });
        setViewModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setViewModalOpen(false);
    setModalContentUrl(null);
  };

  const isPdf = () => {
    if (value instanceof File) return value.type === 'application/pdf';
    const name = (fileName || (typeof value === 'string' && value) || '').toLowerCase();
    return name.endsWith('.pdf');
  };

  const getDownloadFilename = () => {
    const name = fileName || (typeof value === 'string' && value?.split?.('/').pop()) || 'document.pdf';
    return name.endsWith('.pdf') ? name : `${name}.pdf`;
  };

  const handleDownload = async () => {
    const downloadName = getDownloadFilename();
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      const a = document.createElement('a');
      a.href = url;
      a.download = value.name || downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }
    if (value && typeof value === 'string') {
      if (value.startsWith('http') && value.includes('cloudinary.com')) {
        const token = typeof window !== 'undefined' && localStorage.getItem('inventory_admin_token');
        const proxyUrl = `${getApiUrl('/staff/download-document')}?url=${encodeURIComponent(value)}&filename=${encodeURIComponent(downloadName)}`;
        try {
          const res = await fetch(proxyUrl, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          if (!res.ok) throw new Error('Download failed');
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } catch {
          window.open(value, '_blank');
        }
        return;
      }
      if (value.startsWith('http')) {
        window.open(value, '_blank');
        return;
      }
      if (value.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = value;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    }
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <Typography variant="body2" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
        {label}
      </Typography>
      
      {/* File Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          style={{ 
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff'
          }}
          id={`file-${fieldName}`}
        />
      </Box>

      {/* File Info and Actions */}
      {(fileName || value) && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          padding: 1,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          marginTop: 1
        }}>
          {preview ? (
            <Box
              component="img"
              src={preview}
              alt="Preview"
              sx={{
                width: 60,
                height: 60,
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid #ddd'
              }}
            />
          ) : (
            <Box
              sx={{
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                border: '1px solid #ddd',
                backgroundColor: '#e0e0e0',
                color: '#666'
              }}
            >
              {(fileName || (typeof value === 'string' && value) || '').toLowerCase().endsWith('.pdf') ? (
                <PictureAsPdfIcon sx={{ fontSize: 28 }} />
              ) : (
                <InsertDriveFileIcon sx={{ fontSize: 28 }} />
              )}
            </Box>
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" color="textSecondary" sx={{ wordBreak: 'break-all' }}>
              {fileName || (value && typeof value === 'string' ? value.split('/').pop() : 'File attached')}
            </Typography>
          </Box>
          {isPdf() ? (
            <IconButton
              size="small"
              color="primary"
              onClick={handleDownload}
              title="Download PDF"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              size="small"
              color="primary"
              onClick={handleView}
              title="View document"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton 
            size="small" 
            color="error" 
            onClick={handleClear}
            title="Remove file"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {!fileName && !value && (
        <Typography variant="caption" color="textSecondary">
          No file chosen
        </Typography>
      )}

      {/* View document modal */}
      <Dialog
        open={viewModalOpen}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{label}</span>
          <IconButton size="small" onClick={handleCloseModal} aria-label="close">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0, minHeight: 400, backgroundColor: '#fafafa' }}>
          {modalContentUrl?.type === 'image' && modalContentUrl.url && (
            <Box
              component="img"
              src={modalContentUrl.url}
              alt="Document"
              sx={{
                width: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto',
              }}
            />
          )}
          {modalContentUrl?.type === 'pdf' && modalContentUrl.url && (
            <Box sx={{ width: '100%', height: '70vh', minHeight: 400, display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ px: 2, py: 1, backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  href={modalContentUrl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab
                </Button>
              </Box>
              <Box
                component="iframe"
                src={
                  modalContentUrl.url.startsWith('http')
                    ? `https://docs.google.com/viewer?url=${encodeURIComponent(modalContentUrl.url)}&embedded=true`
                    : modalContentUrl.url
                }
                title="PDF Document"
                sx={{
                  flex: 1,
                  width: '100%',
                  minHeight: 380,
                  border: 'none',
                }}
              />
            </Box>
          )}
          {modalContentUrl?.type === 'filename' && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <InsertDriveFileIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {modalContentUrl.name || 'Document'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Preview is not available for this file. The document is stored as a reference.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const EditStaff = () => {
  const params = useParams();
  const router = useRouter();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  const validate = () => {
    let tempErrors = {};
    if (!formData.staffName) tempErrors.staffName = "Staff name is required";
    if (!formData.dob) tempErrors.dob = "Date of birth is required";
    if (!formData.mobileNo) tempErrors.mobileNo = "Mobile number is required";
    if (!formData.emailId) tempErrors.emailId = "Email ID is required";
    else if (!/\S+@\S+\.\S+/.test(formData.emailId)) tempErrors.emailId = "Invalid email format";
    
    if (!formData.addressLine1 && !formData.address) tempErrors.addressLine1 = "Address is required";
    if (!formData.city) tempErrors.city = "City is required";
    if (!formData.district) tempErrors.district = "District is required";
    if (!formData.pinCode) tempErrors.pinCode = "Pin code is required";
    if (!formData.state) tempErrors.state = "State is required";

    if (!formData.branchName && !formData.warehouse) tempErrors.branchWarehouse = "Branch/Warehouse is required";
    if (!formData.designation) tempErrors.designation = "Designation is required";
    if (!formData.department) tempErrors.department = "Department is required";
    if (!formData.permissionRoleId) tempErrors.permissionRoleId = "Role is required";
    
    if (!formData.salary || formData.salary <= 0) tempErrors.salary = "Valid salary is required";
    if (!formData.joiningDate) tempErrors.joiningDate = "Joining date is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const [formData, setFormData] = useState({
    staffName: '',
    gender: 'Male',
    dob: '',
    mobileNo: '',
    emailId: '',
    qualification: '',
    experience: '',
    address: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    pinCode: '',
    state: '',
    branchName: '',
    designation: '',
    department: '',
    role: 'Operator',
    warehouse: '',
    salary: '',
    joiningDate: '',
    resumeCertificate: '',
    highestQualificationCertificate: '',
    panCard: '',
    aadharCard: '',
    accountHolderName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    bankBranch: '',
    branchLocation: '',
    permissionRoleId: ''
  });

  const [permissionRoles, setPermissionRoles] = useState([]);

  useEffect(() => {
    const loadDropdownData = async () => {
      setLoadingDropdowns(true);
      try {
        const warehousesData = await fetchWarehouses();
        console.log('Warehouses fetched:', warehousesData);
        if (Array.isArray(warehousesData)) {
          setWarehouses(warehousesData);
        } else if (warehousesData?.data && Array.isArray(warehousesData.data)) {
          setWarehouses(warehousesData.data);
        } else {
          console.error('Unexpected warehouses data format:', warehousesData);
          setWarehouses([]);
        }
      } catch (err) {
        console.error('Failed to fetch warehouses:', err);
        setWarehouses([]);
      }

      try {
        const rolesData = await fetchRoles();
        console.log('Roles fetched:', rolesData);
        if (Array.isArray(rolesData)) {
          setPermissionRoles(rolesData);
        } else if (rolesData?.data && Array.isArray(rolesData.data)) {
          setPermissionRoles(rolesData.data);
        } else {
          console.error('Unexpected roles data format:', rolesData);
          setPermissionRoles([]);
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setPermissionRoles([]);
      }

      setLoadingDropdowns(false);
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    if (!params?.id) return;
    setLoading(true);
    fetchStaffById(params.id)
      .then((data) => {
        setFormData({
          ...data,
          addressLine1: data.addressLine1 || data.address,
          addressLine2: data.addressLine2 || '',
          city: data.city || '',
          district: data.district || '',
          pinCode: data.pinCode || '',
          state: data.state || '',
          // Ensure all document fields are properly set
          resumeCertificate: data.resumeCertificate || '',
          highestQualificationCertificate: data.highestQualificationCertificate || '',
          panCard: data.panCard || '',
          aadharCard: data.aadharCard || '',
        });
      })
      .catch((err) => setError(err.message || 'Failed to load staff'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleInputChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'permissionRoleId') {
        const role = permissionRoles.find(r => r._id === value || r.id === value);
        next.role = role ? role.name : (value ? value : prev.role || 'Staff');
      }
      if (field === 'branchWarehouse') {
        next.branchName = value;
        next.warehouse = value;
      }
      if (field === 'address') next.addressLine1 = value;
      return next;
    });
  };

  const handleDocumentChange = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        addressLine1: formData.addressLine1 || formData.address,
        addressLine2: formData.addressLine2,
        city: formData.city,
        district: formData.district,
        pinCode: formData.pinCode,
        state: formData.state,
      };
      
      // If you need to handle file uploads separately, do it here
      // For now, we're including the file names/paths in the payload
      
      await updateStaff(params.id, payload);
      router.push('/staff');
    } catch (err) {
      setError(err.message || 'Failed to update staff');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.back();

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
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Personal Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Staff Name *"
                      value={formData.staffName}
                      onChange={(e) => handleInputChange('staffName', e.target.value)}
                      required
                      error={!!errors.staffName}
                      helperText={errors.staffName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <FormLabel component="legend">Gender *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <FormControlLabel value="Male" control={<Radio />} label="Male" />
                        <FormControlLabel value="Female" control={<Radio />} label="Female" />
                        <FormControlLabel value="Others" control={<Radio />} label="Others" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Date of Birth *"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                      error={!!errors.dob}
                      helperText={errors.dob}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Mobile Number *"
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange('mobileNo', e.target.value)}
                      required
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email ID *"
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      required
                      error={!!errors.emailId}
                      helperText={errors.emailId}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Qualification"
                      value={formData.qualification}
                      onChange={(e) => handleInputChange('qualification', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address Line 1 *"
                      value={formData.addressLine1 || formData.address}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      required
                      error={!!errors.addressLine1}
                      helperText={errors.addressLine1}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="City *"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="District *"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      required
                      error={!!errors.district}
                      helperText={errors.district}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="Pin Code *"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                      required
                      error={!!errors.pinCode}
                      helperText={errors.pinCode}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="State *"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      required
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Company Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Company Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.branchWarehouse}>
                      <InputLabel>Branch / Warehouse *</InputLabel>
                      <Select
                        value={formData.branchName || formData.warehouse || ''}
                        onChange={(e) => handleInputChange('branchWarehouse', e.target.value)}
                        label="Branch / Warehouse *"
                        required
                        disabled={loadingDropdowns}
                      >
                        <MenuItem value="">
                          <em>{loadingDropdowns ? 'Loading...' : 'Select branch or warehouse'}</em>
                        </MenuItem>
                        {(warehouses || []).map((w) => {
                          const name = w.name || w.warehouseName || w.branchName || w.warehouse_name || w.location || 'Unnamed';
                          const id = w._id || w.id || name;
                          return <MenuItem key={id} value={name}>{name}</MenuItem>;
                        })}
                      </Select>
                      {errors.branchWarehouse && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.branchWarehouse}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Designation *"
                      value={formData.designation}
                      onChange={(e) => handleInputChange('designation', e.target.value)}
                      required
                      error={!!errors.designation}
                      helperText={errors.designation}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.department}>
                      <InputLabel>Department *</InputLabel>
                      <Select
                        value={formData.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        label="Department *"
                        required
                      >
                        {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                      </Select>
                      {errors.department && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.department}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth error={!!errors.permissionRoleId}>
                      <InputLabel>Role *</InputLabel>
                      <Select
                        value={formData.permissionRoleId || ''}
                        onChange={(e) => handleInputChange('permissionRoleId', e.target.value || '')}
                        label="Role *"
                        required
                        disabled={loadingDropdowns}
                      >
                        <MenuItem value="">
                          <em>{loadingDropdowns ? 'Loading...' : 'Select role'}</em>
                        </MenuItem>
                        {(permissionRoles || []).map((r) => {
                          const roleId = r._id || r.id;
                          const roleName = r.name || r.roleName || r.role || 'Unnamed Role';
                          return <MenuItem key={roleId} value={roleId}>{roleName}</MenuItem>;
                        })}
                      </Select>
                      {errors.permissionRoleId && <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>{errors.permissionRoleId}</Typography>}
                    </FormControl>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Salary *"
                      type="number"
                      value={formData.salary}
                      onChange={(e) => handleInputChange('salary', e.target.value)}
                      required
                      error={!!errors.salary}
                      helperText={errors.salary}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Joining Date *"
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      required
                      error={!!errors.joiningDate}
                      helperText={errors.joiningDate}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Documents */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Document Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUpload
                      label="Highest Qualification Certificate"
                      value={formData.highestQualificationCertificate}
                      onChange={(file) => handleDocumentChange('highestQualificationCertificate', file)}
                      fieldName="highestQualificationCertificate"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUpload
                      label="Aadhar Card"
                      value={formData.aadharCard}
                      onChange={(file) => handleDocumentChange('aadharCard', file)}
                      fieldName="aadharCard"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUpload
                      label="Pan Card"
                      value={formData.panCard}
                      onChange={(file) => handleDocumentChange('panCard', file)}
                      fieldName="panCard"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <DocumentUpload
                      label="Resume Certificate"
                      value={formData.resumeCertificate}
                      onChange={(file) => handleDocumentChange('resumeCertificate', file)}
                      fieldName="resumeCertificate"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Bank Details */}
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
                  Bank Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Account Holder Name"
                      value={formData.accountHolderName}
                      onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Account Number"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Bank Name"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="IFSC Code"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Bank Branch"
                      value={formData.bankBranch}
                      onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Branch Location"
                      value={formData.branchLocation}
                      onChange={(e) => handleInputChange('branchLocation', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Action Buttons */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', marginTop: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{ minWidth: 120, transform: 'none', textTransform: 'none' }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ minWidth: 120, transform: 'none', textTransform: 'none' }}
              >
                {submitting ? <CircularProgress size={24} /> : 'Update Staff'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default EditStaff;