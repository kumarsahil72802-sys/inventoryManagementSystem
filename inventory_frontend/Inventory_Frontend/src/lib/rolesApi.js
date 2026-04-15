import { fetchWithAuth } from './api';

export async function fetchRoles() {
  const res = await fetchWithAuth('/roles');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to fetch roles');
  return data.data || [];
}

export async function fetchRoleById(id) {
  const res = await fetchWithAuth(`/roles/${id}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to fetch role');
  return data.data;
}

export async function createRole(name, permissions = {}) {
  const res = await fetchWithAuth('/roles', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim(), permissions }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to create role');
  return data.data;
}

export async function updateRole(id, { name, permissions }) {
  const body = {};
  if (name !== undefined) body.name = name.trim();
  if (permissions !== undefined) body.permissions = permissions;
  const res = await fetchWithAuth(`/roles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to update role');
  return data.data;
}

export async function deleteRole(id) {
  const res = await fetchWithAuth(`/roles/${id}`, { method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Failed to delete role');
  return data;
}
