'use client';

import React, { useState, useEffect, Suspense } from 'react';
import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add, Save } from '@mui/icons-material';
import { useSearchParams } from 'next/navigation';
import MenuItems from '../../../components/Menuitem';
import { fetchRoles, createRole, updateRole } from '../../../lib/rolesApi';

// Flatten menu items into modules list (parent + sub-items)
function getModulesList() {
  const modules = [];
  MenuItems.forEach((item) => {
    if (item.item && item.item.length > 0) {
      item.item.forEach((sub) => {
        modules.push({ id: sub.href, label: sub.label, parent: item.label });
      });
    } else {
      modules.push({ id: item.href, label: item.label, parent: null });
    }
  });
  return modules;
}

const MODULES = getModulesList();

const defaultPermissions = () =>
  MODULES.reduce((acc, m) => {
    acc[m.id] = { create: false, read: false, update: false, delete: false };
    return acc;
  }, {});

const ManagePermissions = () => {
  const searchParams = useSearchParams();
  const roleIdFromUrl = searchParams.get('roleId') || '';

  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [roleName, setRoleName] = useState('');
  const [permissions, setPermissions] = useState(defaultPermissions());
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRoles()
      .then(setRoles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (roleIdFromUrl && roles.length > 0) {
      const exists = roles.some((r) => r._id === roleIdFromUrl);
      if (exists) setSelectedRoleId(roleIdFromUrl);
    }
  }, [roleIdFromUrl, roles]);

  useEffect(() => {
    if (!selectedRoleId) {
      setPermissions(defaultPermissions());
      setRoleName('');
      return;
    }
    const role = roles.find((r) => r._id === selectedRoleId);
    if (role) {
      setRoleName(role.name);
      const merged = defaultPermissions();
      if (role.permissions && typeof role.permissions === 'object') {
        Object.keys(role.permissions).forEach((id) => {
          if (merged[id]) {
            merged[id] = { ...merged[id], ...role.permissions[id] };
          }
        });
      }
      setPermissions(merged);
    }
  }, [selectedRoleId, roles]);

  const handlePermissionChange = (moduleId, action) => (e) => {
    setPermissions((prev) => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], [action]: e.target.checked },
    }));
    setSuccess('');
  };

  const handleSelectAll = (action) => (e) => {
    const checked = e.target.checked;
    setPermissions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], [action]: checked };
      });
      return next;
    });
    setSuccess('');
  };

  const handleCreateRole = async () => {
    if (!roleName.trim()) return;
    setError('');
    setIsCreating(true);
    try {
      const created = await createRole(roleName.trim(), permissions);
      setRoles((prev) => [created, ...prev]);
      setSelectedRoleId(created._id);
      setSuccess('Role created successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSavePermissions = async () => {
    if (!selectedRoleId) {
      setError('Please create or select a role first.');
      return;
    }
    setError('');
    setIsSaving(true);
    try {
      await updateRole(selectedRoleId, { permissions });
      setRoles((prev) =>
        prev.map((r) => (r._id === selectedRoleId ? { ...r, permissions } : r))
      );
      setSuccess('Permissions saved successfully.');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
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
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRoleId}
            label="Select Role"
            onChange={(e) => {
              setSelectedRoleId(e.target.value);
              setSuccess('');
            }}
          >
            <MenuItem value="">— Create new role —</MenuItem>
            {roles.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Role Name"
          value={roleName}
          onChange={(e) => {
            setRoleName(e.target.value);
            setSuccess('');
          }}
          placeholder="e.g., Sales Manager, Warehouse Admin"
          sx={{ minWidth: 280 }}
          size="small"
        />
        <Button
          variant="contained"
          onClick={handleCreateRole}
          disabled={!roleName.trim() || isCreating}
          sx={{ textTransform: 'none', height: 40 }}
        >
          {isCreating ? <CircularProgress size={20} /> : <Add sx={{ mr: 0.5, fontSize: 18 }} />}
          Create Role
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#333' }}>
        Permissions
      </Typography>
      <Paper sx={{ overflow: 'auto' }}>
        <Table className="hrms-table" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 600, minWidth: 220 }}>Module</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Checkbox
                    size="small"
                    onChange={handleSelectAll('create')}
                    sx={{ p: 0.25 }}
                  />
                  Create
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Checkbox
                    size="small"
                    onChange={handleSelectAll('read')}
                    sx={{ p: 0.25 }}
                  />
                  Read
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Checkbox
                    size="small"
                    onChange={handleSelectAll('update')}
                    sx={{ p: 0.25 }}
                  />
                  Update
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600, minWidth: 100 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Checkbox
                    size="small"
                    onChange={handleSelectAll('delete')}
                    sx={{ p: 0.25 }}
                  />
                  Delete
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {MODULES.map((mod) => (
              <TableRow key={mod.id} hover>
                <TableCell sx={{ fontWeight: 500 }}>
                  {mod.parent ? (
                    <Typography variant="body2" color="text.secondary">
                      {mod.parent} › {mod.label}
                    </Typography>
                  ) : (
                    mod.label
                  )}
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={permissions[mod.id]?.create ?? false}
                    onChange={handlePermissionChange(mod.id, 'create')}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={permissions[mod.id]?.read ?? false}
                    onChange={handlePermissionChange(mod.id, 'read')}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={permissions[mod.id]?.update ?? false}
                    onChange={handlePermissionChange(mod.id, 'update')}
                  />
                </TableCell>
                <TableCell align="center">
                  <Checkbox
                    size="small"
                    checked={permissions[mod.id]?.delete ?? false}
                    onChange={handlePermissionChange(mod.id, 'delete')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSavePermissions}
          disabled={!selectedRoleId || isSaving}
          sx={{ textTransform: 'none', minWidth: 180 }}
        >
          {isSaving ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <>
              <Save sx={{ mr: 1, fontSize: 18 }} />
              Save Permissions
            </>
          )}
        </Button>
      </Box>
    </div>
  );
};

const ManagePermissionsWrapper = () => {
  return (
    <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>}>
      <ManagePermissions />
    </Suspense>
  );
};

export default ManagePermissionsWrapper;
