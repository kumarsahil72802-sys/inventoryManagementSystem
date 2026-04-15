import { apiClient } from './api';

// ================================
// VALUATION API
// ================================

export const fetchValuations = async () => {
  try {
    const response = await apiClient.get('/valuation');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchValuationById = async (id) => {
  try {
    const response = await apiClient.get(`/valuation/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createValuation = async (valuationData) => {
  try {
    const response = await apiClient.post('/valuation', valuationData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateValuation = async (id, valuationData) => {
  try {
    const response = await apiClient.put(`/valuation/${id}`, valuationData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteValuation = async (id) => {
  try {
    const response = await apiClient.delete(`/valuation/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================================
// DEAD STOCK API
// ================================

export const fetchDeadStock = async () => {
  try {
    const response = await apiClient.get('/valuation/dead-stock');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchDeadStockById = async (id) => {
  try {
    const response = await apiClient.get(`/valuation/dead-stock/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createDeadStock = async (deadStockData) => {
  try {
    const response = await apiClient.post('/valuation/dead-stock', deadStockData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateDeadStock = async (id, deadStockData) => {
  try {
    const response = await apiClient.put(`/valuation/dead-stock/${id}`, deadStockData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteDeadStock = async (id) => {
  try {
    const response = await apiClient.delete(`/valuation/dead-stock/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================================
// COGS API
// ================================

export const fetchCOGS = async () => {
  try {
    const response = await apiClient.get('/valuation/cogs');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchCOGSById = async (id) => {
  try {
    const response = await apiClient.get(`/valuation/cogs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createCOGS = async (cogsData) => {
  try {
    const response = await apiClient.post('/valuation/cogs', cogsData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateCOGS = async (id, cogsData) => {
  try {
    const response = await apiClient.put(`/valuation/cogs/${id}`, cogsData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteCOGS = async (id) => {
  try {
    const response = await apiClient.delete(`/valuation/cogs/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// ================================
// FIFO/LIFO/WEIGHTED AVERAGE API
// ================================

export const fetchFifoLifoWeighted = async () => {
  try {
    const response = await apiClient.get('/valuation/fifo-lifo-weighted');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchFifoLifoWeightedById = async (id) => {
  try {
    const response = await apiClient.get(`/valuation/fifo-lifo-weighted/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createFifoLifoWeighted = async (data) => {
  try {
    const response = await apiClient.post('/valuation/fifo-lifo-weighted', data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateFifoLifoWeighted = async (id, data) => {
  try {
    const response = await apiClient.put(`/valuation/fifo-lifo-weighted/${id}`, data);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const deleteFifoLifoWeighted = async (id) => {
  try {
    const response = await apiClient.delete(`/valuation/fifo-lifo-weighted/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
