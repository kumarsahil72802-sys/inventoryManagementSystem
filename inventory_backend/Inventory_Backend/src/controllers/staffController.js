import StaffModel from '../models/staffModel.js';
import { uploadDocument } from '../utils/uploadToCloudinary.js';
import { isValidEmail, isValidPhone } from '../utils/validationHelper.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

const DOC_FIELDS = ['highestQualificationCertificate', 'aadharCard', 'panCard', 'resumeCertificate'];

/**
 * Build staff payload from req.body. When body comes from multipart, values are strings.
 */
function buildStaffData(body, documentUrls = {}) {
  const address = typeof body.address === 'string' ? (() => {
    try { return JSON.parse(body.address); } catch (_) { return {}; }
  })() : (body.address || {});

  const data = {
    name: body.name,
    DOB: body.DOB ? new Date(body.DOB) : undefined,
    gender: body.gender,
    qualification: body.qualification,
    experience: body.experience,
    branchName: body.branchName,
    designation: body.designation,
    highestQualificationCertificate: documentUrls.highestQualificationCertificate ?? body.highestQualificationCertificate,
    aadharCard: documentUrls.aadharCard ?? body.aadharCard,
    panCard: documentUrls.panCard ?? body.panCard,
    resumeCertificate: documentUrls.resumeCertificate ?? body.resumeCertificate,
    accountHolderName: body.accountHolderName,
    accountNumber: body.accountNumber || undefined,
    bankName: body.bankName,
    IFSC: body.IFSC,
    bankBranch: body.bankBranch,
    bankLocation: body.bankLocation,
    email: body.email,
    phone: body.phone,
    role: body.role,
    department: body.department,
    warehouse: body.warehouse,
    status: body.status,
    joiningDate: body.joiningDate ? new Date(body.joiningDate) : undefined,
    salary: body.salary != null ? Number(body.salary) : undefined,
    address: {
      line1: address.line1 ?? body.addressLine1 ?? '',
      line2: address.line2 ?? body.addressLine2 ?? '',
      city: address.city ?? body.city ?? '',
      district: address.district ?? body.district ?? '',
      pinCode: address.pinCode ?? body.pinCode ?? '',
      state: address.state ?? body.state ?? '',
    },
  };
  return data;
}

/**
 * Upload files from req.files to Cloudinary and return { fieldName: url }.
 */
async function uploadStaffDocuments(files) {
  const urls = {};
  if (!files) return urls;

  for (const field of DOC_FIELDS) {
    const arr = files[field];
    if (!arr || !arr[0]) continue;
    const file = arr[0];
    try {
      const url = await uploadDocument(file.buffer, field, file.mimetype);
      urls[field] = url;
    } catch (err) {
    }
  }
  return urls;
}

// Get all staff with pagination
export const getAllStaff = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StaffModel,
      {},
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Staff fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching staff', error));
  }
};

// Get staff by ID
export const getStaffById = async (req, res) => {
  try {
    const staff = await StaffModel.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    res.json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching staff',
      error: error.message
    });
  }
};

// Create new staff
export const createStaff = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const { name, email, phone, role, department, DOB, joiningDate, salary, address } = req.body;

    // Validation
    if (!name || !email || !phone || !role || !department) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, Phone, Role, and Department are required'
      });
    }

    // Validate required fields from schema that were missing
    if (!DOB) {
      return res.status(400).json({
        success: false,
        message: 'Date of Birth (DOB) is required'
      });
    }

    if (!joiningDate) {
      return res.status(400).json({
        success: false,
        message: 'Joining Date is required'
      });
    }

    if (salary === undefined || salary === null || salary === '') {
      return res.status(400).json({
        success: false,
        message: 'Salary is required'
      });
    }

    // Validate address fields
    const addressData = address || {};
    const addressLine1 = addressData.line1 || req.body.addressLine1;
    const city = addressData.city || req.body.city;
    const district = addressData.district || req.body.district;
    const pinCode = addressData.pinCode || req.body.pinCode;
    const state = addressData.state || req.body.state;

    if (!addressLine1) {
      return res.status(400).json({
        success: false,
        message: 'Address Line 1 is required'
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'City is required'
      });
    }

    if (!district) {
      return res.status(400).json({
        success: false,
        message: 'District is required'
      });
    }

    if (!pinCode) {
      return res.status(400).json({
        success: false,
        message: 'Pin Code is required'
      });
    }

    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State is required'
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

    const documentUrls = await uploadStaffDocuments(req.files);
    const isMultipart = !!req.files;
    const staffData = isMultipart
      ? buildStaffData(req.body, documentUrls)
      : { ...req.body, ...documentUrls };

    if (staffData.address && typeof staffData.address === 'object' && !staffData.address.line1 && req.body.addressLine1) {
      staffData.address.line1 = req.body.addressLine1;
      staffData.address.line2 = req.body.addressLine2;
      staffData.address.city = req.body.city;
      staffData.address.district = req.body.district;
      staffData.address.pinCode = req.body.pinCode;
      staffData.address.state = req.body.state;
    }

    const staff = new StaffModel(staffData);
    await staff.save();
    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      data: staff
    });
  } catch (error) {
    console.error('Staff creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating staff',
      error: error.message
    });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
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

    const documentUrls = await uploadStaffDocuments(req.files);
    const isMultipart = !!req.files;
    const staffData = isMultipart
      ? buildStaffData(req.body, documentUrls)
      : { ...req.body, ...documentUrls };

    if (staffData.address && typeof staffData.address === 'object' && req.body.addressLine1 != null) {
      staffData.address.line1 = req.body.addressLine1 ?? staffData.address.line1;
      staffData.address.line2 = req.body.addressLine2 ?? staffData.address.line2;
      staffData.address.city = req.body.city ?? staffData.address.city;
      staffData.address.district = req.body.district ?? staffData.address.district;
      staffData.address.pinCode = req.body.pinCode ?? staffData.address.pinCode;
      staffData.address.state = req.body.state ?? staffData.address.state;
    }

    const staff = await StaffModel.findByIdAndUpdate(
      req.params.id,
      staffData,
      { new: true, runValidators: true }
    );
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    res.json({
      success: true,
      message: 'Staff updated successfully',
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating staff',
      error: error.message
    });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  try {
    const staff = await StaffModel.findByIdAndDelete(req.params.id);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff not found'
      });
    }
    res.json({
      success: true,
      message: 'Staff deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting staff',
      error: error.message
    });
  }
};

// Proxy download for staff documents (e.g. Cloudinary PDF) so browser gets Content-Disposition: attachment
export const downloadStaffDocument = async (req, res) => {
  try {
    const { url, filename } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, message: 'Missing url' });
    }
    const decodedUrl = decodeURIComponent(url);
    if (!decodedUrl.startsWith('https://res.cloudinary.com/') && !decodedUrl.startsWith('http://res.cloudinary.com/')) {
      return res.status(400).json({ success: false, message: 'Invalid document URL' });
    }
    const response = await fetch(decodedUrl);
    if (!response.ok) {
      return res.status(502).json({ success: false, message: 'Failed to fetch document' });
    }
    const contentType = response.headers.get('content-type') || 'application/pdf';
    const name = (filename && decodeURIComponent(String(filename))) || 'document.pdf';
    res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/"/g, '%22')}"`);
    res.setHeader('Content-Type', contentType);
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading document',
      error: error.message
    });
  }
};
