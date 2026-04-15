import StockModel, { StockBatchModel, StockInOutModel, OpeningStockModel, RealTimeStockModel, StockTransferModel } from '../models/stockModel.js';
import ItemModel from '../models/itemModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Get all stock transactions with pagination
export const getAllStockTransactions = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockModel,
      {},
      {
        populate: [{ path: 'itemId', select: 'name sku' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock transactions fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock transactions', error));
  }
};

// Get stock transaction by ID
export const getStockTransactionById = async (req, res) => {
  try {
    const stockTransaction = await StockModel.findById(req.params.id)
      .populate('itemId', 'name sku');
    if (!stockTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Stock transaction not found'
      });
    }
    res.json({
      success: true,
      data: stockTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock transaction',
      error: error.message
    });
  }
};

// Create new stock transaction
export const createStockTransaction = async (req, res) => {
  try {
    const { itemId, itemName, sku, warehouse, transactionType, quantity, unit, performedBy } = req.body;

    if (!itemId || !itemName || !sku || !warehouse || !transactionType || !quantity || !unit || !performedBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Warehouse, TransactionType, Quantity, Unit, PerformedBy) are required'
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }

    const stockTransaction = new StockModel(req.body);
    await stockTransaction.save();
    
    // Update item stock
    const item = await ItemModel.findById(stockTransaction.itemId);
    if (item) {
      if (stockTransaction.transactionType === 'Stock In') {
        item.currentStock += stockTransaction.quantity;
      } else if (stockTransaction.transactionType === 'Stock Out') {
        item.currentStock -= stockTransaction.quantity;
      }
      await item.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Stock transaction created successfully',
      data: stockTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock transaction',
      error: error.message
    });
  }
};

// Update stock transaction
export const updateStockTransaction = async (req, res) => {
  try {
    const stockTransaction = await StockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stockTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Stock transaction not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock transaction updated successfully',
      data: stockTransaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock transaction',
      error: error.message
    });
  }
};

// Delete stock transaction
export const deleteStockTransaction = async (req, res) => {
  try {
    const stockTransaction = await StockModel.findByIdAndDelete(req.params.id);
    if (!stockTransaction) {
      return res.status(404).json({
        success: false,
        message: 'Stock transaction not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock transaction deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting stock transaction',
      error: error.message
    });
  }
};

// Get stock by warehouse
export const getStockByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const stock = await StockModel.find({ warehouse })
      .populate('itemId', 'name sku')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock by warehouse',
      error: error.message
    });
  }
};

// Get stock by item
export const getStockByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const stock = await StockModel.find({ itemId })
      .populate('itemId', 'name sku')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: stock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock by item',
      error: error.message
    });
  }
};

// ================================
// STOCK BATCH CONTROLLERS
// ================================

// Get all stock batches with pagination
export const getAllStockBatches = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockBatchModel,
      {},
      {
        populate: [
          { path: 'itemId' },
          { path: 'warehouseId' },
          { path: 'supplierId' },
          { path: 'createdBy' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock batches fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock batches', error));
  }
};

// Get stock batch by ID
export const getStockBatchById = async (req, res) => {
  try {
    const batch = await StockBatchModel.findById(req.params.id)
      .populate('itemId')
      .populate('warehouseId')
      .populate('supplierId')
      .populate('createdBy');
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Stock batch not found'
      });
    }
    res.json({
      success: true,
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock batch',
      error: error.message
    });
  }
};

// Create new stock batch
export const createStockBatch = async (req, res) => {
  try {
    const { 
      itemId, batchNumber, warehouseId, quantity, availableQuantity, 
      purchaseDate, purchasePrice, sellingPrice, costPrice, createdBy 
    } = req.body;

    if (!itemId || !batchNumber || !warehouseId || quantity == null || 
        availableQuantity == null || !purchaseDate || purchasePrice == null || 
        sellingPrice == null || costPrice == null || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, BatchNumber, WarehouseID, Quantity, AvailableQuantity, PurchaseDate, PurchasePrice, SellingPrice, CostPrice, CreatedBy) are required'
      });
    }

    const batch = new StockBatchModel(req.body);
    await batch.save();
    res.status(201).json({
      success: true,
      message: 'Stock batch created successfully',
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock batch',
      error: error.message
    });
  }
};

// Update stock batch
export const updateStockBatch = async (req, res) => {
  try {
    const batch = await StockBatchModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Stock batch not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock batch updated successfully',
      data: batch
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock batch',
      error: error.message
    });
  }
};

// Delete stock batch
export const deleteStockBatch = async (req, res) => {
  try {
    const batch = await StockBatchModel.findByIdAndDelete(req.params.id);
    if (!batch) {
      return res.status(404).json({
        success: false,
        message: 'Stock batch not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock batch deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting stock batch',
      error: error.message
    });
  }
};

// ================================
// STOCK IN/OUT CONTROLLERS
// ================================

// Get all stock in/out records with pagination
export const getAllStockInOut = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockInOutModel,
      {},
      {
        populate: [
          { path: 'itemId' },
          { path: 'supplierId' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock in/out records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock in/out records', error));
  }
};

// Get stock in/out by ID
export const getStockInOutById = async (req, res) => {
  try {
    const record = await StockInOutModel.findById(req.params.id)
      .populate('itemId')
      .populate('supplierId');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Stock in/out record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock in/out record',
      error: error.message
    });
  }
};

// Create new stock in/out record
export const createStockInOut = async (req, res) => {
  try {
    const { itemId, transactionType, quantity } = req.body;

    if (!itemId || !transactionType || quantity == null) {
      return res.status(400).json({
        success: false,
        message: 'ItemID, TransactionType, and Quantity are required'
      });
    }

    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive number'
      });
    }

    const record = new StockInOutModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Stock in/out record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock in/out record',
      error: error.message
    });
  }
};

// Update stock in/out record
export const updateStockInOut = async (req, res) => {
  try {
    const record = await StockInOutModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Stock in/out record not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock in/out record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock in/out record',
      error: error.message
    });
  }
};

// Delete stock in/out record
export const deleteStockInOut = async (req, res) => {
  try {
    const record = await StockInOutModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Stock in/out record not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock in/out record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting stock in/out record',
      error: error.message
    });
  }
};

// ================================
// OPENING STOCK CONTROLLERS
// ================================

// Get all opening stock records with pagination
export const getAllOpeningStock = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      OpeningStockModel,
      {},
      {
        populate: [
          { path: 'itemId' },
          { path: 'warehouseId' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Opening stock records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching opening stock records', error));
  }
};

// Get opening stock by ID
export const getOpeningStockById = async (req, res) => {
  try {
    const record = await OpeningStockModel.findById(req.params.id)
      .populate('itemId')
      .populate('warehouseId')
      .populate('createdBy')
      .populate('verifiedBy');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Opening stock record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching opening stock record',
      error: error.message
    });
  }
};

// Create new opening stock record
export const createOpeningStock = async (req, res) => {
  try {
    const { itemId, warehouseId, quantity, unitPrice, openingDate } = req.body;

    if (!itemId || !warehouseId || quantity == null || !unitPrice || !openingDate) {
      return res.status(400).json({
        success: false,
        message: 'ItemID, WarehouseID, Quantity, UnitPrice, and OpeningDate are required'
      });
    }

    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a non-negative number'
      });
    }

    const record = new OpeningStockModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Opening stock record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating opening stock record',
      error: error.message
    });
  }
};

// Update opening stock record
export const updateOpeningStock = async (req, res) => {
  try {
    const record = await OpeningStockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Opening stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Opening stock record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating opening stock record',
      error: error.message
    });
  }
};

// Delete opening stock record
export const deleteOpeningStock = async (req, res) => {
  try {
    const record = await OpeningStockModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Opening stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Opening stock record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting opening stock record',
      error: error.message
    });
  }
};

// ================================
// REAL-TIME STOCK CONTROLLERS
// ================================

// Get all real-time stock records with pagination
export const getAllRealTimeStock = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      RealTimeStockModel,
      {},
      {
        populate: [
          { path: 'itemId' },
          { path: 'warehouseId' }
        ],
        sort: { updatedAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Real-time stock records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching real-time stock records', error));
  }
};

// Get real-time stock by ID
export const getRealTimeStockById = async (req, res) => {
  try {
    const record = await RealTimeStockModel.findById(req.params.id)
      .populate('itemId')
      .populate('warehouseId');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Real-time stock record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching real-time stock record',
      error: error.message
    });
  }
};

// Create new real-time stock record
export const createRealTimeStock = async (req, res) => {
  try {
    const { itemId, warehouseId, currentStock, availableStock } = req.body;

    if (!itemId || !warehouseId || currentStock == null || availableStock == null) {
      return res.status(400).json({
        success: false,
        message: 'ItemID, WarehouseID, CurrentStock, and AvailableStock are required'
      });
    }

    const record = new RealTimeStockModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Real-time stock record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating real-time stock record',
      error: error.message
    });
  }
};

// Update real-time stock record
export const updateRealTimeStock = async (req, res) => {
  try {
    const record = await RealTimeStockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Real-time stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Real-time stock record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating real-time stock record',
      error: error.message
    });
  }
};

// Delete real-time stock record
export const deleteRealTimeStock = async (req, res) => {
  try {
    const record = await RealTimeStockModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Real-time stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Real-time stock record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting real-time stock record',
      error: error.message
    });
  }
};

// ================================
// STOCK TRANSFER CONTROLLERS
// ================================

// Get all stock transfers with pagination
export const getAllStockTransfers = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockTransferModel,
      {},
      {
        populate: [
          { path: 'fromWarehouse' },
          { path: 'toWarehouse' },
          { path: 'items.itemId' },
          { path: 'initiatedBy' },
          { path: 'approvedBy' },
          { path: 'receivedBy' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock transfers fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock transfers', error));
  }
};

// Get stock transfer by ID
export const getStockTransferById = async (req, res) => {
  try {
    const transfer = await StockTransferModel.findById(req.params.id)
      .populate('fromWarehouse')
      .populate('toWarehouse')
      .populate('items.itemId')
      .populate('initiatedBy')
      .populate('approvedBy')
      .populate('receivedBy');
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Stock transfer not found'
      });
    }
    res.json({
      success: true,
      data: transfer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock transfer',
      error: error.message
    });
  }
};

// Create new stock transfer
export const createStockTransfer = async (req, res) => {
  try {
    const { transferNumber, fromWarehouse, toWarehouse, items, totalValue, transferDate, initiatedBy } = req.body;

    if (!transferNumber || !fromWarehouse || !toWarehouse || !items || 
        items.length === 0 || totalValue == null || !transferDate || !initiatedBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (TransferNumber, FromWarehouse, ToWarehouse, Items, TotalValue, TransferDate, InitiatedBy) are required'
      });
    }

    const transfer = new StockTransferModel(req.body);
    await transfer.save();
    res.status(201).json({
      success: true,
      message: 'Stock transfer created successfully',
      data: transfer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock transfer',
      error: error.message
    });
  }
};

// Update stock transfer
export const updateStockTransfer = async (req, res) => {
  try {
    const transfer = await StockTransferModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Stock transfer not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock transfer updated successfully',
      data: transfer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating stock transfer',
      error: error.message
    });
  }
};

// Delete stock transfer
export const deleteStockTransfer = async (req, res) => {
  try {
    const transfer = await StockTransferModel.findByIdAndDelete(req.params.id);
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Stock transfer not found'
      });
    }
    res.json({
      success: true,
      message: 'Stock transfer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting stock transfer',
      error: error.message
    });
  }
};

