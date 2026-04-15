import mongoose from 'mongoose';
import { PurchaseOrderModel, PurchaseReturnModel, CostTrackingModel, GoodsReceiptNoteModel, PendingOrderModel } from '../models/purchaseModel.js';
import ItemModel from '../models/itemModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

const mapPurchaseOrderForUi = (order) => ({
  ...order.toObject(),
  id: order._id,
  orderId: order.orderNumber,
  productName: order.productName || order.itemName || 'N/A',
  status: order.status || 'Pending',
});

// Purchase Orders with pagination
export const getAllPurchaseOrders = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      PurchaseOrderModel,
      {},
      {
        populate: [{ path: 'supplierId', select: 'name companyName' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    const mapped = data.map(mapPurchaseOrderForUi);
    
    res.json(createPaginatedResponse(mapped, pagination, 'Purchase orders fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching purchase orders', error));
  }
};

export const getPurchaseOrderById = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrderModel.findById(req.params.id)
      .populate('supplierId', 'name companyName');
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    res.json({
      success: true,
      data: mapPurchaseOrderForUi(purchaseOrder)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase order',
      error: error.message
    });
  }
};

export const createPurchaseOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      orderNumber, supplierId, productId, itemId, supplierName, 
      orderDate, quantity, unitPrice, totalAmount 
    } = req.body;

    // Basic Validation
    if (!supplierId || (!productId && !itemId) || !supplierName || !orderDate || 
        quantity == null || !unitPrice || totalAmount == null) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'All fields (SupplierId, ProductId/ItemId, SupplierName, OrderDate, Quantity, UnitPrice, TotalAmount) are required'
      });
    }

    const payload = { ...req.body };
    payload.orderNumber = payload.orderNumber || `PO-${Date.now()}`;
    payload.orderDate = payload.orderDate || new Date();
    payload.status = payload.status || 'Pending';

    payload.quantity = Number(payload.quantity || 0);
    payload.totalAmount = Number(payload.totalAmount || 0);

    // Accept either productId (legacy) or itemId from UI payloads.
    const resolvedProductId = payload.productId || payload.itemId;
    if (!resolvedProductId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'productId or itemId is required'
      });
    }
    payload.productId = resolvedProductId;

    // Validate that the item exists
    const itemDoc = await ItemModel.findById(resolvedProductId).session(session);
    if (!itemDoc) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (!payload.supplierId) payload.supplierId = new mongoose.Types.ObjectId();
    if (!payload.supplierName) payload.supplierName = 'Unknown Supplier';
    if (!payload.productName) payload.productName = itemDoc.productName || 'Product';

    // Create the purchase order
    const purchaseOrder = new PurchaseOrderModel(payload);
    await purchaseOrder.save({ session });

    // Increase stock for the item
    await ItemModel.findByIdAndUpdate(
      resolvedProductId,
      { $inc: { stock: quantity } },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Purchase order created successfully and stock updated',
      data: mapPurchaseOrderForUi(purchaseOrder)
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error creating purchase order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

export const updatePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    res.json({
      success: true,
      message: 'Purchase order updated successfully',
      data: mapPurchaseOrderForUi(purchaseOrder)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating purchase order',
      error: error.message
    });
  }
};

export const deletePurchaseOrder = async (req, res) => {
  try {
    const purchaseOrder = await PurchaseOrderModel.findByIdAndDelete(req.params.id);
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: 'Purchase order not found'
      });
    }
    res.json({
      success: true,
      message: 'Purchase order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting purchase order',
      error: error.message
    });
  }
};

// Purchase Returns with pagination
export const getAllPurchaseReturns = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      PurchaseReturnModel,
      {},
      {
        populate: [
          { path: 'supplierId', select: 'name companyName' },
          { path: 'originalOrderId', select: 'orderNumber' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Purchase returns fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching purchase returns', error));
  }
};

export const getPurchaseReturnById = async (req, res) => {
  try {
    const purchaseReturn = await PurchaseReturnModel.findById(req.params.id)
      .populate('supplierId', 'name companyName')
      .populate('originalOrderId', 'orderNumber');
    if (!purchaseReturn) {
      return res.status(404).json({
        success: false,
        message: 'Purchase return not found'
      });
    }
    res.json({
      success: true,
      data: purchaseReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching purchase return',
      error: error.message
    });
  }
};

export const createPurchaseReturn = async (req, res) => {
  try {
    const { 
      originalOrderId, supplierId, returnDate, itemId, 
      itemName, quantity, unitPrice, totalAmount, reason 
    } = req.body;

    if (!originalOrderId || !supplierId || !returnDate || !itemId || 
        !itemName || quantity == null || !unitPrice || totalAmount == null || !reason) {
      return res.status(400).json({
        success: false,
        message: 'All fields (OriginalOrderId, SupplierId, ReturnDate, ItemId, ItemName, Quantity, UnitPrice, TotalAmount, Reason) are required'
      });
    }

    const purchaseReturn = new PurchaseReturnModel(req.body);
    await purchaseReturn.save();
    res.status(201).json({
      success: true,
      message: 'Purchase return created successfully',
      data: purchaseReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating purchase return',
      error: error.message
    });
  }
};

export const updatePurchaseReturn = async (req, res) => {
  try {
    const purchaseReturn = await PurchaseReturnModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!purchaseReturn) {
      return res.status(404).json({
        success: false,
        message: 'Purchase return not found'
      });
    }
    res.json({
      success: true,
      message: 'Purchase return updated successfully',
      data: purchaseReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating purchase return',
      error: error.message
    });
  }
};

export const deletePurchaseReturn = async (req, res) => {
  try {
    const purchaseReturn = await PurchaseReturnModel.findByIdAndDelete(req.params.id);
    if (!purchaseReturn) {
      return res.status(404).json({
        success: false,
        message: 'Purchase return not found'
      });
    }
    res.json({
      success: true,
      message: 'Purchase return deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting purchase return',
      error: error.message
    });
  }
};

// ================================
// COST TRACKING CONTROLLERS
// ================================

// Get all cost tracking records with pagination
export const getAllCostTracking = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      CostTrackingModel,
      {},
      {
        populate: [
          { path: 'purchaseOrderId' },
          { path: 'itemId' },
          { path: 'supplierId' },
          { path: 'createdBy' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Cost tracking records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching cost tracking records', error));
  }
};

// Get cost tracking by ID
export const getCostTrackingById = async (req, res) => {
  try {
    const record = await CostTrackingModel.findById(req.params.id)
      .populate('purchaseOrderId')
      .populate('itemId')
      .populate('supplierId')
      .populate('createdBy');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Cost tracking record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cost tracking record',
      error: error.message
    });
  }
};

// Create new cost tracking record
export const createCostTracking = async (req, res) => {
  try {
    const { purchaseOrderId, itemId, supplierId, baseCost, totalCost, costPerUnit, trackingDate, createdBy } = req.body;

    if (!purchaseOrderId || !itemId || !supplierId || baseCost == null || 
        totalCost == null || costPerUnit == null || !trackingDate || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (PurchaseOrderId, ItemId, SupplierId, BaseCost, TotalCost, CostPerUnit, TrackingDate, CreatedBy) are required'
      });
    }

    const record = new CostTrackingModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Cost tracking record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating cost tracking record',
      error: error.message
    });
  }
};

// Update cost tracking record
export const updateCostTracking = async (req, res) => {
  try {
    const record = await CostTrackingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Cost tracking record not found'
      });
    }
    res.json({
      success: true,
      message: 'Cost tracking record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cost tracking record',
      error: error.message
    });
  }
};

// Delete cost tracking record
export const deleteCostTracking = async (req, res) => {
  try {
    const record = await CostTrackingModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Cost tracking record not found'
      });
    }
    res.json({
      success: true,
      message: 'Cost tracking record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting cost tracking record',
      error: error.message
    });
  }
};

// ================================
// GOODS RECEIPT NOTE CONTROLLERS
// ================================

// Get all goods receipt notes with pagination
export const getAllGoodsReceiptNotes = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      GoodsReceiptNoteModel,
      {},
      {
        populate: [
          { path: 'purchaseOrderId' },
          { path: 'supplierId' },
          { path: 'warehouseId' },
          { path: 'receivedBy' },
          { path: 'verifiedBy' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Goods receipt notes fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching goods receipt notes', error));
  }
};

// Get goods receipt note by ID
export const getGoodsReceiptNoteById = async (req, res) => {
  try {
    const record = await GoodsReceiptNoteModel.findById(req.params.id)
      .populate('purchaseOrderId')
      .populate('supplierId')
      .populate('warehouseId')
      .populate('receivedBy')
      .populate('verifiedBy');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Goods receipt note not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching goods receipt note',
      error: error.message
    });
  }
};

// Create new goods receipt note
export const createGoodsReceiptNote = async (req, res) => {
  try {
    const { 
      grnNumber, purchaseOrderId, supplierId, warehouseId, 
      receiptDate, items, totalAmount, receivedBy 
    } = req.body;

    if (!grnNumber || !purchaseOrderId || !supplierId || !warehouseId || 
        !receiptDate || !items || items.length === 0 || totalAmount == null || !receivedBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (GRN Number, PurchaseOrderId, SupplierId, WarehouseId, ReceiptDate, Items, TotalAmount, ReceivedBy) are required'
      });
    }

    const record = new GoodsReceiptNoteModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Goods receipt note created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating goods receipt note',
      error: error.message
    });
  }
};

// Update goods receipt note
export const updateGoodsReceiptNote = async (req, res) => {
  try {
    const record = await GoodsReceiptNoteModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Goods receipt note not found'
      });
    }
    res.json({
      success: true,
      message: 'Goods receipt note updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating goods receipt note',
      error: error.message
    });
  }
};

// Delete goods receipt note
export const deleteGoodsReceiptNote = async (req, res) => {
  try {
    const record = await GoodsReceiptNoteModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Goods receipt note not found'
      });
    }
    res.json({
      success: true,
      message: 'Goods receipt note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting goods receipt note',
      error: error.message
    });
  }
};

// ================================
// PENDING ORDERS CONTROLLERS
// ================================

// Get all pending orders with pagination
export const getAllPendingOrders = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      PendingOrderModel,
      {},
      {
        populate: [
          { path: 'purchaseOrderId' },
          { path: 'supplierId' },
          { path: 'assignedTo' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Pending orders fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching pending orders', error));
  }
};

// Get pending order by ID
export const getPendingOrderById = async (req, res) => {
  try {
    const record = await PendingOrderModel.findById(req.params.id)
      .populate('purchaseOrderId')
      .populate('supplierId')
      .populate('assignedTo');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Pending order not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending order',
      error: error.message
    });
  }
};

// Create new pending order
export const createPendingOrder = async (req, res) => {
  try {
    const { purchaseOrderId, supplierId, orderDate, expectedDate, totalValue, pendingValue } = req.body;

    if (!purchaseOrderId || !supplierId || !orderDate || !expectedDate || 
        totalValue == null || pendingValue == null) {
      return res.status(400).json({
        success: false,
        message: 'All fields (PurchaseOrderId, SupplierId, OrderDate, ExpectedDate, TotalValue, PendingValue) are required'
      });
    }

    const record = new PendingOrderModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Pending order created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating pending order',
      error: error.message
    });
  }
};

// Update pending order
export const updatePendingOrder = async (req, res) => {
  try {
    const record = await PendingOrderModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Pending order not found'
      });
    }
    res.json({
      success: true,
      message: 'Pending order updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pending order',
      error: error.message
    });
  }
};

// Delete pending order
export const deletePendingOrder = async (req, res) => {
  try {
    const record = await PendingOrderModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Pending order not found'
      });
    }
    res.json({
      success: true,
      message: 'Pending order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting pending order',
      error: error.message
    });
  }
};


