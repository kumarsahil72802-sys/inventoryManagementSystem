import InvoiceModel from '../models/invoiceModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Get all invoices with pagination
export const getAllInvoices = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      InvoiceModel,
      {},
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Invoices fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching invoices', error));
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await InvoiceModel.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice',
      error: error.message
    });
  }
};

// Create new invoice
export const createInvoice = async (req, res) => {
  try {
    const { 
      id, invoiceNumber, customerName, customerEmail, customerPhone, 
      billingAddress, invoiceDate, dueDate, items, subtotal, 
      taxAmount, totalAmount, createdBy 
    } = req.body;

    // Basic Validation
    if (!id || !invoiceNumber || !customerName || !customerEmail || !customerPhone || 
        !billingAddress || !invoiceDate || !dueDate || !items || items.length === 0 || 
        subtotal == null || taxAmount == null || totalAmount == null || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ID, InvoiceNumber, CustomerDetails, Address, Dates, Items, Subtotal, TaxAmount, TotalAmount, CreatedBy) are required'
      });
    }

    const invoice = new InvoiceModel(req.body);
    await invoice.save();
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating invoice',
      error: error.message
    });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating invoice',
      error: error.message
    });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await InvoiceModel.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting invoice',
      error: error.message
    });
  }
};

// Get invoices by customer
export const getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const invoices = await InvoiceModel.find({ customerId })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices by customer',
      error: error.message
    });
  }
};

// Get invoices by payment status
export const getInvoicesByPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.params;
    const invoices = await InvoiceModel.find({ paymentStatus })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoices by payment status',
      error: error.message
    });
  }
};

// Update payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paidAmount } = req.body;
    
    const invoice = await InvoiceModel.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    invoice.paymentStatus = paymentStatus;
    if (paidAmount) {
      invoice.paidAmount = paidAmount;
      invoice.balanceAmount = invoice.totalAmount - paidAmount;
    }
    
    await invoice.save();
    
    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment status',
      error: error.message
    });
  }
};

