import { ValuationModel, DeadStockModel, COGSModel, FifoLifoWeightedModel } from '../models/valuationModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// ================================
// VALUATION CONTROLLERS
// ================================

// Get all valuations with pagination
export const getAllValuations = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ValuationModel,
      {},
      {
        populate: [
          { path: 'itemId', select: 'productName SKUcode category' },
          { path: 'warehouse', select: 'name location' },
          { path: 'createdBy', select: 'name email' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Valuations fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching valuations', error));
  }
};

// Get valuation by ID
export const getValuationById = async (req, res) => {
  try {
    const valuation = await ValuationModel.findById(req.params.id)
      .populate('itemId', 'productName SKUcode category')
      .populate('warehouse', 'name location')
      .populate('createdBy', 'name email');
    if (!valuation) {
      return res.status(404).json({
        success: false,
        message: 'Valuation not found'
      });
    }
    res.json({
      success: true,
      data: valuation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching valuation',
      error: error.message
    });
  }
};

// Create new valuation
export const createValuation = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, warehouse, valuationMethod, 
      currentStock, averageCost, totalValue, createdBy 
    } = req.body;

    if (!itemId || !itemName || !sku || !warehouse || !valuationMethod || 
        currentStock == null || averageCost == null || totalValue == null || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Warehouse, ValuationMethod, CurrentStock, AverageCost, TotalValue, CreatedBy) are required'
      });
    }

    const valuation = new ValuationModel(req.body);
    await valuation.save();
    res.status(201).json({
      success: true,
      message: 'Valuation created successfully',
      data: valuation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating valuation',
      error: error.message
    });
  }
};

// Update valuation
export const updateValuation = async (req, res) => {
  try {
    const valuation = await ValuationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!valuation) {
      return res.status(404).json({
        success: false,
        message: 'Valuation not found'
      });
    }
    res.json({
      success: true,
      message: 'Valuation updated successfully',
      data: valuation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating valuation',
      error: error.message
    });
  }
};

// Delete valuation
export const deleteValuation = async (req, res) => {
  try {
    const valuation = await ValuationModel.findByIdAndDelete(req.params.id);
    if (!valuation) {
      return res.status(404).json({
        success: false,
        message: 'Valuation not found'
      });
    }
    res.json({
      success: true,
      message: 'Valuation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting valuation',
      error: error.message
    });
  }
};

// ================================
// DEAD STOCK CONTROLLERS
// ================================

// Get all dead stock records with pagination
export const getAllDeadStock = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      DeadStockModel,
      {},
      {
        populate: [
          { path: 'itemId', select: 'productName SKUcode category' },
          { path: 'warehouse', select: 'name location' },
          { path: 'createdBy', select: 'name email' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Dead stock records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching dead stock records', error));
  }
};

// Get dead stock by ID
export const getDeadStockById = async (req, res) => {
  try {
    const deadStock = await DeadStockModel.findById(req.params.id)
      .populate('itemId', 'productName SKUcode category')
      .populate('warehouse', 'name location')
      .populate('createdBy', 'name email');
    if (!deadStock) {
      return res.status(404).json({
        success: false,
        message: 'Dead stock record not found'
      });
    }
    res.json({
      success: true,
      data: deadStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dead stock record',
      error: error.message
    });
  }
};

// Create new dead stock record
export const createDeadStock = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, warehouse, currentStock, 
      lastMovementDate, daysSinceLastMovement, costPrice, totalValue, identifiedBy 
    } = req.body;

    if (!itemId || !itemName || !sku || !warehouse || currentStock == null || 
        !lastMovementDate || daysSinceLastMovement == null || costPrice == null || 
        totalValue == null || !identifiedBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Warehouse, CurrentStock, LastMovementDate, DaysSince, CostPrice, TotalValue, IdentifiedBy) are required'
      });
    }

    const deadStock = new DeadStockModel(req.body);
    await deadStock.save();
    res.status(201).json({
      success: true,
      message: 'Dead stock record created successfully',
      data: deadStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating dead stock record',
      error: error.message
    });
  }
};

// Update dead stock record
export const updateDeadStock = async (req, res) => {
  try {
    const deadStock = await DeadStockModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!deadStock) {
      return res.status(404).json({
        success: false,
        message: 'Dead stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Dead stock record updated successfully',
      data: deadStock
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating dead stock record',
      error: error.message
    });
  }
};

// Delete dead stock record
export const deleteDeadStock = async (req, res) => {
  try {
    const deadStock = await DeadStockModel.findByIdAndDelete(req.params.id);
    if (!deadStock) {
      return res.status(404).json({
        success: false,
        message: 'Dead stock record not found'
      });
    }
    res.json({
      success: true,
      message: 'Dead stock record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting dead stock record',
      error: error.message
    });
  }
};

// ================================
// COGS CONTROLLERS
// ================================

// Get all COGS records with pagination
export const getAllCOGS = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      COGSModel,
      {},
      {
        populate: [
          { path: 'itemId', select: 'productName SKUcode category' },
          { path: 'warehouse', select: 'name location' },
          { path: 'createdBy', select: 'name email' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'COGS records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching COGS records', error));
  }
};

// Get COGS by ID
export const getCOGSById = async (req, res) => {
  try {
    const cogs = await COGSModel.findById(req.params.id)
      .populate('itemId', 'productName SKUcode category')
      .populate('warehouse', 'name location')
      .populate('createdBy', 'name email');
    if (!cogs) {
      return res.status(404).json({
        success: false,
        message: 'COGS record not found'
      });
    }
    res.json({
      success: true,
      data: cogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching COGS record',
      error: error.message
    });
  }
};

// Create new COGS record
export const createCOGS = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, warehouse, period, openingStock, 
      purchases, closingStock, cogs, salesQuantity, averageCost, 
      grossProfit, grossProfitMargin, createdBy 
    } = req.body;

    if (!itemId || !itemName || !sku || !warehouse || !period || !openingStock || 
        !purchases || !closingStock || cogs == null || salesQuantity == null || 
        averageCost == null || grossProfit == null || grossProfitMargin == null || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Warehouse, Period, OpeningStock, Purchases, ClosingStock, COGS, SalesQuantity, AverageCost, GrossProfit, GrossProfitMargin, CreatedBy) are required'
      });
    }

    const cogsRecord = new COGSModel(req.body);
    await cogsRecord.save();
    res.status(201).json({
      success: true,
      message: 'COGS record created successfully',
      data: cogsRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating COGS record',
      error: error.message
    });
  }
};

// Update COGS record
export const updateCOGS = async (req, res) => {
  try {
    const cogs = await COGSModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cogs) {
      return res.status(404).json({
        success: false,
        message: 'COGS record not found'
      });
    }
    res.json({
      success: true,
      message: 'COGS record updated successfully',
      data: cogs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating COGS record',
      error: error.message
    });
  }
};

// Delete COGS record
export const deleteCOGS = async (req, res) => {
  try {
    const cogs = await COGSModel.findByIdAndDelete(req.params.id);
    if (!cogs) {
      return res.status(404).json({
        success: false,
        message: 'COGS record not found'
      });
    }
    res.json({
      success: true,
      message: 'COGS record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting COGS record',
      error: error.message
    });
  }
};

// ================================
// FIFO/LIFO/WEIGHTED AVERAGE CONTROLLERS
// ================================

// Get all FIFO/LIFO/Weighted Average records with pagination
export const getAllFifoLifoWeighted = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      FifoLifoWeightedModel,
      {},
      {
        populate: [
          { path: 'itemId', select: 'productName SKUcode category' },
          { path: 'warehouseId', select: 'name location' },
          { path: 'createdBy', select: 'name email' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'FIFO/LIFO/Weighted Average records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching FIFO/LIFO/Weighted Average records', error));
  }
};

// Get FIFO/LIFO/Weighted Average by ID
export const getFifoLifoWeightedById = async (req, res) => {
  try {
    const record = await FifoLifoWeightedModel.findById(req.params.id)
      .populate('itemId', 'productName SKUcode category')
      .populate('warehouseId', 'name location')
      .populate('createdBy', 'name email');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'FIFO/LIFO/Weighted Average record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching FIFO/LIFO/Weighted Average record',
      error: error.message
    });
  }
};

// Create new FIFO/LIFO/Weighted Average record
export const createFifoLifoWeighted = async (req, res) => {
  try {
    const { 
      itemId, warehouseId, valuationMethod, period, 
      totalStock, totalValue, averageCost, createdBy 
    } = req.body;

    if (!itemId || !warehouseId || !valuationMethod || !period || 
        totalStock == null || totalValue == null || averageCost == null || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, WarehouseID, ValuationMethod, Period, TotalStock, TotalValue, AverageCost, CreatedBy) are required'
      });
    }

    const record = new FifoLifoWeightedModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'FIFO/LIFO/Weighted Average record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating FIFO/LIFO/Weighted Average record',
      error: error.message
    });
  }
};

// Update FIFO/LIFO/Weighted Average record
export const updateFifoLifoWeighted = async (req, res) => {
  try {
    const record = await FifoLifoWeightedModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'FIFO/LIFO/Weighted Average record not found'
      });
    }
    res.json({
      success: true,
      message: 'FIFO/LIFO/Weighted Average record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating FIFO/LIFO/Weighted Average record',
      error: error.message
    });
  }
};

// Delete FIFO/LIFO/Weighted Average record
export const deleteFifoLifoWeighted = async (req, res) => {
  try {
    const record = await FifoLifoWeightedModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'FIFO/LIFO/Weighted Average record not found'
      });
    }
    res.json({
      success: true,
      message: 'FIFO/LIFO/Weighted Average record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting FIFO/LIFO/Weighted Average record',
      error: error.message
    });
  }
};