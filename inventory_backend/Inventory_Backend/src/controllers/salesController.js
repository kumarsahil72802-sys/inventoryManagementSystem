import mongoose from 'mongoose';
import { SalesOrderModel, SalesReturnModel, DeliveryChallanModel, OrderTrackingModel } from '../models/salesModel.js';
import ItemModel from '../models/itemModel.js';
import { getPaginationParams, executePaginatedQuery, createPaginatedResponse, createErrorResponse } from '../utils/paginationHelper.js';

const mapSalesOrderForUi = (order) => {
  const paidAmount = Number(order?.paidAmount || 0);
  const totalAmount = Number(order?.totalAmount || 0);

  return {
    ...order.toObject(),
    id: order._id,
    salesOrderId: order.orderNumber,
    orderStatus: order.status,
    pendingAmount: Math.max(totalAmount - paidAmount, 0),
  };
};

// Sales Orders with pagination
export const getAllSalesOrders = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      SalesOrderModel,
      {},
      {
        populate: [{ path: 'customerId', select: 'name companyName' }],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    const mapped = data.map(mapSalesOrderForUi);
    
    res.json(createPaginatedResponse(mapped, pagination, 'Sales orders fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching sales orders', error));
  }
};

export const getSalesOrderById = async (req, res) => {
  try {
    const salesOrder = await SalesOrderModel.findById(req.params.id)
      .populate('customerId', 'name companyName');
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    res.json({
      success: true,
      data: mapSalesOrderForUi(salesOrder)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales order',
      error: error.message
    });
  }
};

export const createSalesOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { 
      customerId, customerName, orderDate, deliveryDate, items, 
      subtotal, taxAmount, totalAmount, warehouse, shippingAddress, createdBy 
    } = req.body;

    // Basic Validation
    if (!customerId || !customerName || !orderDate || !deliveryDate || !items || 
        items.length === 0 || subtotal == null || taxAmount == null || 
        totalAmount == null || !warehouse || !shippingAddress || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (CustomerId, CustomerName, OrderDate, DeliveryDate, Items, Subtotal, TaxAmount, TotalAmount, Warehouse, ShippingAddress, CreatedBy) are required'
      });
    }

    const payload = { ...req.body };

    payload.subtotal = Number(payload.subtotal ?? payload.totalAmount ?? 0);
    payload.taxAmount = Number(payload.taxAmount ?? 0);
    payload.totalAmount = Number(payload.totalAmount ?? payload.subtotal + payload.taxAmount);

    // Validate stock availability for all items
    for (const item of items) {
      const itemDoc = await ItemModel.findById(item.itemId).session(session);
      if (!itemDoc) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Item ${item.itemName} not found`
        });
      }

      if (itemDoc.stock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.itemName}. Available: ${itemDoc.stock}, Requested: ${item.quantity}`
        });
      }
    }

    // Create the sales order
    const salesOrder = new SalesOrderModel(payload);
    await salesOrder.save({ session });

    // Deduct stock for each item
    for (const item of items) {
      await ItemModel.findByIdAndUpdate(
        item.itemId,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: 'Sales order created successfully and stock updated',
      data: mapSalesOrderForUi(salesOrder)
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error creating sales order',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

export const updateSalesOrder = async (req, res) => {
  try {
    const updatePayload = { ...req.body };
    if (updatePayload.orderStatus && !updatePayload.status) {
      updatePayload.status = updatePayload.orderStatus;
    }

    const salesOrder = await SalesOrderModel.findByIdAndUpdate(
      req.params.id,
      updatePayload,
      { new: true, runValidators: true }
    );
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    res.json({
      success: true,
      message: 'Sales order updated successfully',
      data: mapSalesOrderForUi(salesOrder)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sales order',
      error: error.message
    });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const salesOrder = await SalesOrderModel.findByIdAndDelete(req.params.id);
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        message: 'Sales order not found'
      });
    }
    res.json({
      success: true,
      message: 'Sales order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sales order',
      error: error.message
    });
  }
};

// Sales Returns with pagination
export const getAllSalesReturns = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      SalesReturnModel,
      {},
      {
        populate: [
          { path: 'customerId', select: 'name companyName' },
          { path: 'originalOrderId', select: 'orderNumber' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Sales returns fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching sales returns', error));
  }
};

export const getSalesReturnById = async (req, res) => {
  try {
    const salesReturn = await SalesReturnModel.findById(req.params.id)
      .populate('customerId', 'name companyName')
      .populate('originalOrderId', 'orderNumber');
    if (!salesReturn) {
      return res.status(404).json({
        success: false,
        message: 'Sales return not found'
      });
    }
    res.json({
      success: true,
      data: salesReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sales return',
      error: error.message
    });
  }
};

export const createSalesReturn = async (req, res) => {
  try {
    const { 
      returnNumber, originalOrderId, customerId, customerName, 
      returnDate, items, subtotal, taxAmount, totalAmount, warehouse, createdBy 
    } = req.body;

    if (!returnNumber || !originalOrderId || !customerId || !customerName || 
        !returnDate || !items || items.length === 0 || subtotal == null || 
        taxAmount == null || totalAmount == null || !warehouse || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ReturnNumber, OriginalOrderId, CustomerId, CustomerName, ReturnDate, Items, Subtotal, TaxAmount, TotalAmount, Warehouse, CreatedBy) are required'
      });
    }

    const salesReturn = new SalesReturnModel(req.body);
    await salesReturn.save();
    res.status(201).json({
      success: true,
      message: 'Sales return created successfully',
      data: salesReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating sales return',
      error: error.message
    });
  }
};

export const updateSalesReturn = async (req, res) => {
  try {
    const salesReturn = await SalesReturnModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!salesReturn) {
      return res.status(404).json({
        success: false,
        message: 'Sales return not found'
      });
    }
    res.json({
      success: true,
      message: 'Sales return updated successfully',
      data: salesReturn
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating sales return',
      error: error.message
    });
  }
};

export const deleteSalesReturn = async (req, res) => {
  try {
    const salesReturn = await SalesReturnModel.findByIdAndDelete(req.params.id);
    if (!salesReturn) {
      return res.status(404).json({
        success: false,
        message: 'Sales return not found'
      });
    }
    res.json({
      success: true,
      message: 'Sales return deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting sales return',
      error: error.message
    });
  }
};

// Delivery Challans with pagination
export const getAllDeliveryChallans = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      DeliveryChallanModel,
      {},
      {
        populate: [
          { path: 'customerId', select: 'name companyName' },
          { path: 'orderId', select: 'orderNumber' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Delivery challans fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching delivery challans', error));
  }
};

export const getDeliveryChallanById = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findById(req.params.id)
      .populate('customerId', 'name companyName')
      .populate('orderId', 'orderNumber');
    if (!deliveryChallan) {
      return res.status(404).json({
        success: false,
        message: 'Delivery challan not found'
      });
    }
    res.json({
      success: true,
      data: deliveryChallan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery challan',
      error: error.message
    });
  }
};

export const createDeliveryChallan = async (req, res) => {
  try {
    const { 
      challanNumber, orderId, customerId, customerName, deliveryDate, 
      items, deliveryAddress, driverName, vehicleNumber, warehouse, createdBy 
    } = req.body;

    if (!challanNumber || !orderId || !customerId || !customerName || !deliveryDate || 
        !items || items.length === 0 || !deliveryAddress || !driverName || 
        !vehicleNumber || !warehouse || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'All fields (ChallanNumber, OrderId, CustomerId, CustomerName, DeliveryDate, Items, Address, Driver, Vehicle, Warehouse, CreatedBy) are required'
      });
    }

    const deliveryChallan = new DeliveryChallanModel(req.body);
    await deliveryChallan.save();
    res.status(201).json({
      success: true,
      message: 'Delivery challan created successfully',
      data: deliveryChallan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating delivery challan',
      error: error.message
    });
  }
};

export const updateDeliveryChallan = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!deliveryChallan) {
      return res.status(404).json({
        success: false,
        message: 'Delivery challan not found'
      });
    }
    res.json({
      success: true,
      message: 'Delivery challan updated successfully',
      data: deliveryChallan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery challan',
      error: error.message
    });
  }
};

export const deleteDeliveryChallan = async (req, res) => {
  try {
    const deliveryChallan = await DeliveryChallanModel.findByIdAndDelete(req.params.id);
    if (!deliveryChallan) {
      return res.status(404).json({
        success: false,
        message: 'Delivery challan not found'
      });
    }
    res.json({
      success: true,
      message: 'Delivery challan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting delivery challan',
      error: error.message
    });
  }
};

// ================================
// ORDER TRACKING CONTROLLERS
// ================================

// Get all order tracking records with pagination
export const getAllOrderTracking = async (req, res) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    
    const { data, pagination } = await executePaginatedQuery(
      OrderTrackingModel,
      {},
      {
        populate: [
          { path: 'orderId' },
          { path: 'customerId' },
          { path: 'assignedTo' }
        ],
        sort: { createdAt: -1 }
      },
      page,
      limit
    );
    
    res.json(createPaginatedResponse(data, pagination, 'Order tracking records fetched successfully'));
  } catch (error) {
    res.status(500).json(createErrorResponse('Error fetching order tracking records', error));
  }
};

// Get order tracking by ID
export const getOrderTrackingById = async (req, res) => {
  try {
    const record = await OrderTrackingModel.findById(req.params.id)
      .populate('orderId')
      .populate('customerId')
      .populate('assignedTo');
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Order tracking record not found'
      });
    }
    res.json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order tracking record',
      error: error.message
    });
  }
};

// Create new order tracking record
export const createOrderTracking = async (req, res) => {
  try {
    const { orderId, orderNumber, customerId, trackingNumber, deliveryAddress } = req.body;

    if (!orderId || !orderNumber || !customerId || !trackingNumber || !deliveryAddress) {
      return res.status(400).json({
        success: false,
        message: 'All fields (OrderId, OrderNumber, CustomerId, TrackingNumber, DeliveryAddress) are required'
      });
    }

    const record = new OrderTrackingModel(req.body);
    await record.save();
    res.status(201).json({
      success: true,
      message: 'Order tracking record created successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order tracking record',
      error: error.message
    });
  }
};

// Update order tracking record
export const updateOrderTracking = async (req, res) => {
  try {
    const record = await OrderTrackingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Order tracking record not found'
      });
    }
    res.json({
      success: true,
      message: 'Order tracking record updated successfully',
      data: record
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order tracking record',
      error: error.message
    });
  }
};

// Delete order tracking record
export const deleteOrderTracking = async (req, res) => {
  try {
    const record = await OrderTrackingModel.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Order tracking record not found'
      });
    }
    res.json({
      success: true,
      message: 'Order tracking record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order tracking record',
      error: error.message
    });
  }
};


