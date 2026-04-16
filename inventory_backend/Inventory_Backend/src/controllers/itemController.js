import ItemModel, { CategoryModel, SubcategoryModel, HsnSacModel, BatchSerialModel } from '../models/itemModel.js';
import { isValidNumber } from '../utils/validationHelper.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Get all items with pagination
export const getAllItems = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ItemModel,
      {},
      {
        populate: [
          { path: 'category', select: 'name' },
          { path: 'subCategory', select: 'name' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Items fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching items', error));
  }
};

// Get item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await ItemModel.findById(req.params.id).populate('category', 'name').populate('subCategory', 'name');
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item',
      error: error.message
    });
  }
};

// Create new item
export const createItem = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'Request body is missing'
      });
    }

    const { productName, SKUcode, category, subCategory, brand, unitOfMeasure, description, purchasePrice, sellingPrice, taxRate } = req.body;

    // Validation
    if (!productName || !SKUcode || !category || !subCategory || !brand || !unitOfMeasure || !description) {
      return res.status(400).json({
        success: false,
        message: 'Product Name, SKU code, Category, Subcategory, Brand, Unit of Measure, and Description are required'
      });
    }

    if (!isValidNumber(purchasePrice) || purchasePrice === undefined || purchasePrice === null) {
      return res.status(400).json({
        success: false,
        message: 'Purchase Price is required and must be a valid non-negative number'
      });
    }

    if (!isValidNumber(sellingPrice) || sellingPrice === undefined || sellingPrice === null) {
      return res.status(400).json({
        success: false,
        message: 'Selling Price is required and must be a valid non-negative number'
      });
    }

    if (taxRate === undefined || taxRate === null) {
      return res.status(400).json({
        success: false,
        message: 'Tax Rate is required'
      });
    }

    const item = new ItemModel(req.body);
    await item.save();
    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    console.error('Item creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message
    });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const { purchasePrice, sellingPrice } = req.body;

    // Validation for optional fields if provided
    if (purchasePrice !== undefined && !isValidNumber(purchasePrice)) {
      return res.status(400).json({
        success: false,
        message: 'Purchase Price must be a valid non-negative number'
      });
    }

    if (sellingPrice !== undefined && !isValidNumber(sellingPrice)) {
      return res.status(400).json({
        success: false,
        message: 'Selling Price must be a valid non-negative number'
      });
    }

    const item = await ItemModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating item',
      error: error.message
    });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const item = await ItemModel.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting item',
      error: error.message
    });
  }
};

// Get items by category with pagination
export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ItemModel,
      { category },
      { sort: { createdAt: -1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Items fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching items by category', error));
  }
};

// Get low stock items with pagination
export const getLowStockItems = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ItemModel,
      { $expr: { $lte: ['$stock', '$minStock'] } },
      { sort: { stock: 1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Low stock items fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching low stock items', error));
  }
};

// ================================
// CATEGORY CONTROLLERS
// ================================

// Get all categories with pagination
export const getAllCategories = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      CategoryModel,
      {},
      { sort: { sortOrder: 1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Categories fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching categories', error));
  }
};

// Get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
};
import mongoose from 'mongoose';
// Create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category name and description are required'
      });
    }

    const category = new CategoryModel(req.body);
    await category.save();
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
};

// ================================
// SUBCATEGORY CONTROLLERS
// ================================

// Get all subcategories with pagination
export const getAllSubcategories = async (req, res) => {
  try {
    const { page, limit, category } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) {
      filter.category = category;
    }
    
    const { data, pagination } = await executePaginatedQuery(
      SubcategoryModel,
      filter,
      {
        populate: [{ path: 'category' }],
        sort: { sortOrder: 1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Subcategories fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching subcategories', error));
  }
};

// Get subcategory by ID
export const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await SubcategoryModel.findById(req.params.id).populate('category');
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    res.json({
      success: true,
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subcategory',
      error: error.message
    });
  }
};

// Create new subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Subcategory name and category are required'
      });
    }

    const subcategory = new SubcategoryModel(req.body);
    await subcategory.save();
    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subcategory',
      error: error.message
    });
  }
};

// Update subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subcategory',
      error: error.message
    });
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const subcategory = await SubcategoryModel.findByIdAndDelete(req.params.id);
    if (!subcategory) {
      return res.status(404).json({
        success: false,
        message: 'Subcategory not found'
      });
    }
    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting subcategory',
      error: error.message
    });
  }
};

// ================================
// HSN/SAC CODE CONTROLLERS
// ================================

// Get all HSN/SAC codes with pagination
export const getAllHsnSacCodes = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      HsnSacModel,
      {},
      { sort: { code: 1 } },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'HSN/SAC codes fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching HSN/SAC codes', error));
  }
};

// Get HSN/SAC code by ID
export const getHsnSacCodeById = async (req, res) => {
  try {
    const code = await HsnSacModel.findById(req.params.id);
    if (!code) {
      return res.status(404).json({
        success: false,
        message: 'HSN/SAC code not found'
      });
    }
    res.json({
      success: true,
      data: code
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching HSN/SAC code',
      error: error.message
    });
  }
};

// Create new HSN/SAC code
export const createHsnSacCode = async (req, res) => {
  try {
    const { code, category } = req.body;

    if (!code || !category) {
      return res.status(400).json({
        success: false,
        message: 'HSN/SAC code and category are required'
      });
    }

    const codeDoc = new HsnSacModel(req.body);
    await codeDoc.save();
    res.status(201).json({
      success: true,
      message: 'HSN/SAC code created successfully',
      data: code
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating HSN/SAC code',
      error: error.message
    });
  }
};

// Update HSN/SAC code
export const updateHsnSacCode = async (req, res) => {
  try {
    const code = await HsnSacModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!code) {
      return res.status(404).json({
        success: false,
        message: 'HSN/SAC code not found'
      });
    }
    res.json({
      success: true,
      message: 'HSN/SAC code updated successfully',
      data: code
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating HSN/SAC code',
      error: error.message
    });
  }
};

// Delete HSN/SAC code
export const deleteHsnSacCode = async (req, res) => {
  try {
    const code = await HsnSacModel.findByIdAndDelete(req.params.id);
    if (!code) {
      return res.status(404).json({
        success: false,
        message: 'HSN/SAC code not found'
      });
    }
    res.json({
      success: true,
      message: 'HSN/SAC code deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting HSN/SAC code',
      error: error.message
    });
  }
};

// ================================
// BATCH & SERIAL TRACKING CONTROLLERS
// ================================

// Get all batch/serial records with pagination
export const getAllBatchSerialRecords = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      BatchSerialModel,
      {},
      {
        populate: [
          { path: 'itemId' },
          { path: 'supplier' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Batch/serial records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching batch/serial records', error));
  }
};

// Get batch/serial record by ID
export const getBatchSerialRecordById = async (req, res) => {
  try {
    const record = await BatchSerialModel.findById(req.params.id)
      .populate('itemId')
      .populate('supplier');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Batch/Serial record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching batch/serial record',
      error: error.message
    });
  }
};

// Create new batch/serial record
export const createBatchSerialRecord = async (req, res) => {
  try {
    const { itemId, batchNumber, serialNumber, totalQuantity } = req.body;

    if (!itemId || !batchNumber || !serialNumber || totalQuantity == null) {
      return res.status(400).json({
        success: false,
        message: 'ItemID, BatchNumber, SerialNumber, and TotalQuantity are required'
      });
    }

    const record = new BatchSerialModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Batch/Serial record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating batch/serial record',
      error: error.message
    });
  }
};

// Update batch/serial record
export const updateBatchSerialRecord = async (req, res) => {
  try {
    const record = await BatchSerialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Batch/Serial record not found'
      });
    }
    res.json({
      success: true,
      message: 'Batch/Serial record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating batch/serial record',
      error: error.message
    });
  }
};

// Delete batch/serial record
export const deleteBatchSerialRecord = async (req, res) => {
  try {
    const record = await BatchSerialModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Batch/Serial record not found'
      });
    }
    res.json({
      success: true,
      message: 'Batch/Serial record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting batch/serial record',
      error: error.message
    });
  }
};

// Get batch/serial records by item with pagination
export const getBatchSerialRecordsByItem = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      BatchSerialModel,
      { itemId: req.params.itemId },
      {
        populate: [{ path: 'supplier' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Batch/serial records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching batch/serial records by item', error));
  }
};

// Get batch/serial records by warehouse with pagination
export const getBatchSerialRecordsByWarehouse = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      BatchSerialModel,
      { warehouse: req.params.warehouseId },
      {
        populate: [
          { path: 'itemId' },
          { path: 'supplier' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Batch/serial records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching batch/serial records by warehouse', error));
  }
};

