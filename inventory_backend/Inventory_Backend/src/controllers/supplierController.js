import SupplierModel from '../models/supplierModel.js';
import { isValidEmail, isValidPhone } from '../utils/validationHelper.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Get all suppliers with pagination
export const getAllSuppliers = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      SupplierModel,
      {},
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Suppliers fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching suppliers', error));
  }
};

// Get supplier by ID
export const getSupplierById = async (req, res) => {
  try {
    const supplier = await SupplierModel.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching supplier',
      error: error.message
    });
  }
};

// Create new supplier
export const createSupplier = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const { name, companyName, email, phone, address, city, state, pincode, gstNumber, panNumber } = req.body;

    // Validation
    if (!name || !companyName || !email || !phone || !address || !city || !state || !pincode || !gstNumber || !panNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name, Company Name, Email, Phone, Address, City, State, Pincode, GST Number, and PAN Number are required'
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format'
      });
    }

    const supplier = new SupplierModel(req.body);
    await supplier.save();
    res.status(201).json({
      success: true,
      message: 'Supplier created successfully',
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating supplier',
      error: error.message
    });
  }
};

// Update supplier
export const updateSupplier = async (req, res) => {
  try {
    const { email, phone } = req.body;

    // Validation for optional fields if provided
    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone format'
      });
    }

    const supplier = await SupplierModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      message: 'Supplier updated successfully',
      data: supplier
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating supplier',
      error: error.message
    });
  }
};

// Delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await SupplierModel.findByIdAndDelete(req.params.id);
    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: 'Supplier not found'
      });
    }
    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting supplier',
      error: error.message
    });
  }
};

