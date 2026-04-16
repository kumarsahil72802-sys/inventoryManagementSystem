import { apiClient } from './api';

// Get all expenses
export const getAllExpenses = async () => {
  try {
    const response = await apiClient.get('/finance/expenses');
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network Error: Backend server is not running or not accessible at', apiClient.defaults.baseURL);
      throw new Error('Cannot connect to server. Please ensure the backend is running on port 8000.');
    }
    throw error;
  }
};

// Get expense by ID
export const getExpenseById = async (id) => {
  try {
    const response = await apiClient.get(`/finance/expenses/${id}`);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
};

// Create new expense
export const createExpense = async (expenseData) => {
  try {
    const response = await apiClient.post('/finance/expenses', expenseData);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  try {
    const response = await apiClient.put(`/finance/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    const response = await apiClient.delete(`/finance/expenses/${id}`);
    return response.data;
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Cannot connect to server. Please ensure the backend is running.');
    }
    throw error;
  }
};

// Get expenses by warehouse
export const getExpensesByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/finance/expenses/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all income
export const getAllIncome = async () => {
  try {
    const response = await apiClient.get('/finance/income');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Alias for getAllIncome (for backwards compatibility)
export const getAllIncomes = getAllIncome;

// Get income by ID
export const getIncomeById = async (id) => {
  try {
    const response = await apiClient.get(`/finance/income/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new income
export const createIncome = async (incomeData) => {
  try {
    const response = await apiClient.post('/finance/income', incomeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update income
export const updateIncome = async (id, incomeData) => {
  try {
    const response = await apiClient.put(`/finance/income/${id}`, incomeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete income
export const deleteIncome = async (id) => {
  try {
    const response = await apiClient.delete(`/finance/income/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get income by warehouse
export const getIncomeByWarehouse = async (warehouseId) => {
  try {
    const response = await apiClient.get(`/finance/income/warehouse/${warehouseId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};