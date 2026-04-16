import { apiClient } from './api';

// Get all purchase orders
export const getAllPurchaseOrders = async () => {
  try {
    const response = await apiClient.get('/purchase/orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get purchase order by ID
export const getPurchaseOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/purchase/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new purchase order
export const createPurchaseOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/purchase/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update purchase order
export const updatePurchaseOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/purchase/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete purchase order
export const deletePurchaseOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/purchase/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// PURCHASE RETURNS API
// ================================

export const getAllPurchaseReturns = async () => {
  try {
    const response = await apiClient.get('/purchase/returns');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseReturnById = async (id) => {
  try {
    const response = await apiClient.get(`/purchase/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPurchaseReturn = async (returnData) => {
  try {
    const response = await apiClient.post('/purchase/returns', returnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePurchaseReturn = async (id, returnData) => {
  try {
    const response = await apiClient.put(`/purchase/returns/${id}`, returnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePurchaseReturn = async (id) => {
  try {
    const response = await apiClient.delete(`/purchase/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// COST TRACKING API
// ================================

export const getAllCostTracking = async () => {
  try {
    const response = await apiClient.get('/purchase/cost-tracking');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCostTrackingById = async (id) => {
  try {
    const response = await apiClient.get(`/purchase/cost-tracking/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createCostTracking = async (trackingData) => {
  try {
    const response = await apiClient.post('/purchase/cost-tracking', trackingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateCostTracking = async (id, trackingData) => {
  try {
    const response = await apiClient.put(`/purchase/cost-tracking/${id}`, trackingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCostTracking = async (id) => {
  try {
    const response = await apiClient.delete(`/purchase/cost-tracking/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// GOODS RECEIPT NOTES API
// ================================

export const getAllGoodsReceiptNotes = async () => {
  try {
    const response = await apiClient.get('/purchase/goods-receipt-notes');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGoodsReceiptNoteById = async (id) => {
  try {
    const response = await apiClient.get(`/purchase/goods-receipt-notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createGoodsReceiptNote = async (noteData) => {
  try {
    const response = await apiClient.post('/purchase/goods-receipt-notes', noteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateGoodsReceiptNote = async (id, noteData) => {
  try {
    const response = await apiClient.put(`/purchase/goods-receipt-notes/${id}`, noteData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteGoodsReceiptNote = async (id) => {
  try {
    const response = await apiClient.delete(`/purchase/goods-receipt-notes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// PENDING ORDERS API
// ================================

export const getAllPendingOrders = async () => {
  try {
    const response = await apiClient.get('/purchase/pending-orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPendingOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/purchase/pending-orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPendingOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/purchase/pending-orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePendingOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/purchase/pending-orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePendingOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/purchase/pending-orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
