import ItemModel from '../models/itemModel.js';
import { SalesOrderModel } from '../models/salesModel.js';
import { PurchaseOrderModel } from '../models/purchaseModel.js';
import { ExpenseModel, IncomeModel } from '../models/financeModel.js';
import WarehouseModel from '../models/warehouseModel.js';

export const getDashboardData = async (req, res) => {
  try {
    const [
      items,
      lowStockItems,
      salesOrders,
      purchaseOrders,
      expenses,
      income,
      warehouses,
    ] = await Promise.all([
      ItemModel.find(),
      ItemModel.find({ $expr: { $lte: ['$stock', '$reorderPoint'] } }),
      SalesOrderModel.find(),
      PurchaseOrderModel.find(),
      ExpenseModel.find(),
      IncomeModel.find(),
      WarehouseModel.find(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        items,
        lowStockItems,
        salesOrders,
        purchaseOrders,
        expenses,
        income,
        warehouses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};
