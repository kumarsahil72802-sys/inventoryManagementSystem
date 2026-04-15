'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { fetchStaffList } from '@/lib/staffApi';

const UsersRolesIndex = () => {
  const router = useRouter();
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchStaffList()
      .then(setStaffData)
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = (Array.isArray(staffData) ? staffData : []).filter(
    (u) =>
      (u.staffName || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.emailId || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.permissionRoleName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAddPermission = (user) => {
    const roleId = user.permissionRoleId || '';
    if (roleId) {
      router.push(`/roles-permissions/manage?roleId=${roleId}`);
    } else {
      router.push('/roles-permissions/manage');
    }
  };

  const handleManagePermissions = () => {
    router.push('/roles-permissions/manage');
  };

  if (loading) {
    return (
      <div className="content-area">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </div>
    );
  }

  return (
    <div className="content-area">
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 320, '& .MuiOutlinedInput-root': { height: 40 } }}
        />
        <Button
          variant="contained"
          onClick={handleManagePermissions}
          sx={{ textTransform: 'none', height: 40 }}
        >
          <Add sx={{ mr: 1, fontSize: 18 }} />
          Manage roles & permissions
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
        Users & their roles
      </Typography>
      <Paper sx={{ overflow: 'auto' }}>
        <Table className="hrms-table" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600 }}>S. No.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Designation (Job role)</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Permission role</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user, index) => (
                <TableRow key={user.id || user.staffId} hover>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {user.staffName || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.emailId || '-'}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>{user.role || user.designation || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color={user.permissionRoleName ? 'text.primary' : 'text.secondary'}>
                      {user.permissionRoleName || '— Not set —'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleAddPermission(user)}
                      sx={{ textTransform: 'none' }}
                    >
                      {user.permissionRoleName ? 'Edit permission' : 'Add permission'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default UsersRolesIndex;
