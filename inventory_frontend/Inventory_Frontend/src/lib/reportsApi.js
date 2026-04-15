import { apiClient } from './api';

// Get stock summary report
export const getStockSummary = async () => {
  try {
    const response = await apiClient.get('/reports/stock-summary');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create stock summary report
export const createStockSummary = async (reportData) => {
  try {
    const response = await apiClient.post('/reports/stock-summary', reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get stock summary by warehouse
export const getStockSummaryByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/reports/stock-summary/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get item sales report
export const getItemSales = async () => {
  try {
    const response = await apiClient.get('/reports/item-sales');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create item sales report
export const createItemSales = async (reportData) => {
  try {
    const response = await apiClient.post('/reports/item-sales', reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get item sales by warehouse
export const getItemSalesByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/reports/item-sales/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get stock aging report
export const getStockAging = async () => {
  try {
    const response = await apiClient.get('/reports/stock-aging');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create stock aging report
export const createStockAging = async (reportData) => {
  try {
    const response = await apiClient.post('/reports/stock-aging', reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get stock aging by warehouse
export const getStockAgingByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/reports/stock-aging/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get valuation report
export const getValuationReport = async () => {
  try {
    const response = await apiClient.get('/reports/valuation');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create valuation report
export const createValuationReport = async (reportData) => {
  try {
    const response = await apiClient.post('/reports/valuation', reportData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get valuation report by warehouse
export const getValuationReportByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/reports/valuation/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};