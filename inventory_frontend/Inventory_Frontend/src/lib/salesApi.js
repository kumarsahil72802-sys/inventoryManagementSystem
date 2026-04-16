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

// ================================
// SALES RETURNS API
// ================================

// Get all sales returns
export const getAllSalesReturns = async () => {
  try {
    const response = await apiClient.get('/sales/returns');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get sales return by ID
export const getSalesReturnById = async (id) => {
  try {
    const response = await apiClient.get(`/sales/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new sales return
export const createSalesReturn = async (returnData) => {
  try {
    const response = await apiClient.post('/sales/returns', returnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update sales return
export const updateSalesReturn = async (id, returnData) => {
  try {
    const response = await apiClient.put(`/sales/returns/${id}`, returnData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete sales return
export const deleteSalesReturn = async (id) => {
  try {
    const response = await apiClient.delete(`/sales/returns/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// DELIVERY CHALLANS API
// ================================

// Get all delivery challans
export const getAllDeliveryChallans = async () => {
  try {
    const response = await apiClient.get('/sales/delivery-challans');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get delivery challan by ID
export const getDeliveryChallanById = async (id) => {
  try {
    const response = await apiClient.get(`/sales/delivery-challans/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new delivery challan
export const createDeliveryChallan = async (challanData) => {
  try {
    const response = await apiClient.post('/sales/delivery-challans', challanData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update delivery challan
export const updateDeliveryChallan = async (id, challanData) => {
  try {
    const response = await apiClient.put(`/sales/delivery-challans/${id}`, challanData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete delivery challan
export const deleteDeliveryChallan = async (id) => {
  try {
    const response = await apiClient.delete(`/sales/delivery-challans/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ================================
// ORDER TRACKING API
// ================================

// Get all order tracking records
export const getAllOrderTracking = async () => {
  try {
    const response = await apiClient.get('/sales/order-tracking');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get order tracking by ID
export const getOrderTrackingById = async (id) => {
  try {
    const response = await apiClient.get(`/sales/order-tracking/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new order tracking record
export const createOrderTracking = async (trackingData) => {
  try {
    const response = await apiClient.post('/sales/order-tracking', trackingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update order tracking record
export const updateOrderTracking = async (id, trackingData) => {
  try {
    const response = await apiClient.put(`/sales/order-tracking/${id}`, trackingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete order tracking record
export const deleteOrderTracking = async (id) => {
  try {
    const response = await apiClient.delete(`/sales/order-tracking/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
