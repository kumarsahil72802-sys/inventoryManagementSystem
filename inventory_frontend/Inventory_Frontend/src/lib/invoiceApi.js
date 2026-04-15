import { apiClient } from './api';

// Get all invoices
export const getAllInvoices = async () => {
  try {
    const response = await apiClient.get('/invoices');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get invoice by ID
export const getInvoiceById = async (id) => {
  try {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new invoice
export const createInvoice = async (invoiceData) => {
  try {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update invoice
export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await apiClient.put(`/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete invoice
export const deleteInvoice = async (id) => {
  try {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update payment status
export const updatePaymentStatus = async (id, paymentStatus) => {
  try {
    const response = await apiClient.put(`/invoices/${id}/payment-status`, { paymentStatus });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get invoices by customer
export const getInvoicesByCustomer = async (customerId) => {
  try {
    const response = await apiClient.get(`/invoices/customer/${customerId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get invoices by payment status
export const getInvoicesByPaymentStatus = async (paymentStatus) => {
  try {
    const response = await apiClient.get(`/invoices/payment-status/${paymentStatus}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};