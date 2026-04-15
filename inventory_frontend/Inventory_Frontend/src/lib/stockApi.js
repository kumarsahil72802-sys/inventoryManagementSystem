import { fetchWithAuth } from './api';

// ================================
// REAL-TIME STOCK
// ================================

export async function fetchRealTimeStock() {
  const res = await fetchWithAuth('/stock/real-time');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch real-time stock');
  return json.data || [];
}

export async function fetchRealTimeStockById(id) {
  const res = await fetchWithAuth(`/stock/real-time/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch real-time stock details');
  return json.data;
}

export async function createRealTimeStock(data) {
  const res = await fetchWithAuth('/stock/real-time', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create real-time stock');
  return json.data;
}

export async function updateRealTimeStock(id, data) {
  const res = await fetchWithAuth(`/stock/real-time/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update real-time stock');
  return json.data;
}

export async function deleteRealTimeStock(id) {
  const res = await fetchWithAuth(`/stock/real-time/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete real-time stock');
  return json;
}

// ================================
// STOCK IN/OUT
// ================================

export async function fetchStockInOut() {
  const res = await fetchWithAuth('/stock/in-out');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock in/out');
  return json.data || [];
}

export async function fetchStockInOutById(id) {
  const res = await fetchWithAuth(`/stock/in-out/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock in/out record');
  return json.data;
}

export async function createStockInOut(data) {
  const res = await fetchWithAuth('/stock/in-out', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create stock in/out record');
  return json.data;
}

export async function updateStockInOut(id, data) {
  const res = await fetchWithAuth(`/stock/in-out/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update stock in/out record');
  return json.data;
}

export async function deleteStockInOut(id) {
  const res = await fetchWithAuth(`/stock/in-out/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete stock in/out record');
  return json;
}

// ================================
// OPENING STOCK
// ================================

export async function fetchOpeningStock() {
  const res = await fetchWithAuth('/stock/opening');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch opening stock');
  return json.data || [];
}

export async function fetchOpeningStockById(id) {
  const res = await fetchWithAuth(`/stock/opening/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch opening stock record');
  return json.data;
}

export async function createOpeningStock(data) {
  const res = await fetchWithAuth('/stock/opening', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create opening stock record');
  return json.data;
}

export async function updateOpeningStock(id, data) {
  const res = await fetchWithAuth(`/stock/opening/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update opening stock record');
  return json.data;
}

export async function deleteOpeningStock(id) {
  const res = await fetchWithAuth(`/stock/opening/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete opening stock record');
  return json;
}

// ================================
// STOCK TRANSFERS
// ================================

export async function fetchStockTransfers() {
  const res = await fetchWithAuth('/stock/transfers');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock transfers');
  return json.data || [];
}

export async function fetchStockTransferById(id) {
  const res = await fetchWithAuth(`/stock/transfers/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock transfer');
  return json.data;
}

export async function createStockTransfer(data) {
  const res = await fetchWithAuth('/stock/transfers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create stock transfer');
  return json.data;
}

export async function updateStockTransfer(id, data) {
  const res = await fetchWithAuth(`/stock/transfers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update stock transfer');
  return json.data;
}

export async function deleteStockTransfer(id) {
  const res = await fetchWithAuth(`/stock/transfers/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete stock transfer');
  return json;
}

// ================================
// STOCK TRANSACTIONS (legacy)
// ================================

export async function fetchStockTransactions() {
  const res = await fetchWithAuth('/stock/transactions');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock transactions');
  return json.data || [];
}

export async function fetchStockTransactionById(id) {
  const res = await fetchWithAuth(`/stock/transactions/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock transaction details');
  return json.data;
}

export async function createStockTransaction(data) {
  const res = await fetchWithAuth('/stock/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create stock transaction');
  return json.data;
}

export async function updateStockTransaction(id, data) {
  const res = await fetchWithAuth(`/stock/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update stock transaction');
  return json.data;
}

export async function deleteStockTransaction(id) {
  const res = await fetchWithAuth(`/stock/transactions/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete stock transaction');
  return json;
}

export async function fetchStockByWarehouse(warehouseId) {
  const res = await fetchWithAuth(`/stock/warehouse/${warehouseId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock for warehouse');
  return json.data || [];
}

export async function fetchStockByItem(itemId) {
  const res = await fetchWithAuth(`/stock/item/${itemId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock for item');
  return json.data || [];
}

// ================================
// STOCK BATCHES
// ================================

export async function fetchStockBatches() {
  const res = await fetchWithAuth('/stock/batches');
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock batches');
  return json.data || [];
}

export async function fetchStockBatchById(id) {
  const res = await fetchWithAuth(`/stock/batches/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to fetch stock batch details');
  return json.data;
}

export async function createStockBatch(data) {
  const res = await fetchWithAuth('/stock/batches', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to create stock batch');
  return json.data;
}

export async function updateStockBatch(id, data) {
  const res = await fetchWithAuth(`/stock/batches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to update stock batch');
  return json.data;
}

export async function deleteStockBatch(id) {
  const res = await fetchWithAuth(`/stock/batches/${id}`, {
    method: 'DELETE',
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || 'Failed to delete stock batch');
  return json;
}
