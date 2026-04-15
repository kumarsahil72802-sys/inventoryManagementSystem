import { apiClient } from './api';

// Get all sales orders
export const getAllSalesOrders = async () => {
  try {
    const response = await apiClient.get('/sales/orders');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get sales order by ID
export const getSalesOrderById = async (id) => {
  try {
    const response = await apiClient.get(`/sales/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new sales order
export const createSalesOrder = async (orderData) => {
  try {
    const response = await apiClient.post('/sales/orders', orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update sales order
export const updateSalesOrder = async (id, orderData) => {
  try {
    const response = await apiClient.put(`/sales/orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete sales order
export const deleteSalesOrder = async (id) => {
  try {
    const response = await apiClient.delete(`/sales/orders/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
