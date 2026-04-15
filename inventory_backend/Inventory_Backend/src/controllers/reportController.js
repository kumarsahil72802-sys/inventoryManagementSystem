import { StockSummaryModel, ItemSalesModel, StockAgingModel, ValuationReportModel } from '../models/reportModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

// Stock Summary Report with pagination
export const getStockSummary = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockSummaryModel,
      {},
      {
        populate: [{ path: 'itemId', select: 'productName SKUcode' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock summary fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock summary', error));
  }
};

export const createStockSummary = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, category, warehouse, currentStock, 
      unit, costPrice, sellingPrice, totalValue, minStock, maxStock, stockStatus 
    } = req.body;

    if (!itemId || !itemName || !sku || !category || !warehouse || currentStock == null || 
        !unit || costPrice == null || sellingPrice == null || totalValue == null || 
        minStock == null || maxStock == null || !stockStatus) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Category, Warehouse, CurrentStock, Unit, CostPrice, SellingPrice, TotalValue, MinStock, MaxStock, StockStatus) are required'
      });
    }

    const stockSummary = new StockSummaryModel(req.body);
    await stockSummary.save();
    res.status(201).json({
      success: true,
      message: 'Stock summary created successfully',
      data: stockSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock summary',
      error: error.message
    });
  }
};

// Item Sales Report with pagination
export const getItemSales = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ItemSalesModel,
      {},
      {
        populate: [{ path: 'itemId', select: 'productName SKUcode' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Item sales fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching item sales', error));
  }
};

export const createItemSales = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, category, period, totalQuantitySold, 
      totalRevenue, averagePrice, totalOrders, warehouse, salesTrend 
    } = req.body;

    if (!itemId || !itemName || !sku || !category || !period || 
        totalQuantitySold == null || totalRevenue == null || averagePrice == null || 
        totalOrders == null || !warehouse || !salesTrend) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Category, Period, TotalQuantitySold, TotalRevenue, AveragePrice, TotalOrders, Warehouse, SalesTrend) are required'
      });
    }

    const itemSales = new ItemSalesModel(req.body);
    await itemSales.save();
    res.status(201).json({
      success: true,
      message: 'Item sales record created successfully',
      data: itemSales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating item sales record',
      error: error.message
    });
  }
};

// Stock Aging Report with pagination
export const getStockAging = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      StockAgingModel,
      {},
      {
        populate: [{ path: 'itemId', select: 'productName SKUcode' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Stock aging fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching stock aging', error));
  }
};

export const createStockAging = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, category, warehouse, currentStock, unit, 
      costPrice, totalValue, lastMovementDate, daysSinceLastMovement, 
      agingCategory, status 
    } = req.body;

    if (!itemId || !itemName || !sku || !category || !warehouse || currentStock == null || 
        !unit || costPrice == null || totalValue == null || !lastMovementDate || 
        daysSinceLastMovement == null || !agingCategory || !status) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Category, Warehouse, CurrentStock, Unit, CostPrice, TotalValue, LastMovementDate, DaysSince, AgingCategory, Status) are required'
      });
    }

    const stockAging = new StockAgingModel(req.body);
    await stockAging.save();
    res.status(201).json({
      success: true,
      message: 'Stock aging record created successfully',
      data: stockAging
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating stock aging record',
      error: error.message
    });
  }
};

// Valuation Report with pagination
export const getValuationReport = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      ValuationReportModel,
      {},
      {
        populate: [{ path: 'itemId', select: 'productName SKUcode' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Valuation report fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching valuation report', error));
  }
};

export const createValuationReport = async (req, res) => {
  try {
    const { 
      itemId, itemName, sku, category, warehouse, valuationMethod, 
      currentStock, unit, averageCost, totalValue, lastPurchasePrice, 
      lastSalePrice, profitMargin 
    } = req.body;

    if (!itemId || !itemName || !sku || !category || !warehouse || !valuationMethod || 
        currentStock == null || !unit || averageCost == null || totalValue == null || 
        lastPurchasePrice == null || lastSalePrice == null || profitMargin == null) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ItemID, ItemName, SKU, Category, Warehouse, ValuationMethod, CurrentStock, Unit, AverageCost, TotalValue, LastPurchasePrice, LastSalePrice, ProfitMargin) are required'
      });
    }

    const valuationReport = new ValuationReportModel(req.body);
    await valuationReport.save();
    res.status(201).json({
      success: true,
      message: 'Valuation report created successfully',
      data: valuationReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating valuation report',
      error: error.message
    });
  }
};

// Get reports by warehouse
export const getStockSummaryByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const stockSummary = await StockSummaryModel.find({ warehouse })
      .populate('itemId', 'productName SKUcode')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: stockSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock summary by warehouse',
      error: error.message
    });
  }
};

export const getItemSalesByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const itemSales = await ItemSalesModel.find({ warehouse })
      .populate('itemId', 'productName SKUcode')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: itemSales
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching item sales by warehouse',
      error: error.message
    });
  }
};

export const getStockAgingByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const stockAging = await StockAgingModel.find({ warehouse })
      .populate('itemId', 'productName SKUcode')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: stockAging
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stock aging by warehouse',
      error: error.message
    });
  }
};

export const getValuationReportByWarehouse = async (req, res) => {
  try {
    const { warehouse } = req.params;
    const valuationReport = await ValuationReportModel.find({ warehouse })
      .populate('itemId', 'productName SKUcode')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: valuationReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching valuation report by warehouse',
      error: error.message
    });
  }
};

