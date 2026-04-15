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
