import express from 'express';
import { verifyToken } from '../middleware/auth.js';

// Import all controller functions
import {  loginAdmin} from '../controllers/authController.js';
import { getAllStaff, getStaffById, createStaff, updateStaff, deleteStaff, downloadStaffDocument } from '../controllers/staffController.js';
import { staffDocumentUpload } from '../middleware/staffUpload.js';
import { 
  getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse, addBinToWarehouse,
  getAllBinRacks, getBinRackById, createBinRack, updateBinRack, deleteBinRack, getBinRacksByWarehouse,
  getAllWarehouseCapacities, getWarehouseCapacityById, createWarehouseCapacity, updateWarehouseCapacity, deleteWarehouseCapacity, getCapacityByWarehouse,
  getAllWarehouseSetups, getWarehouseSetupById, createWarehouseSetup, updateWarehouseSetup, deleteWarehouseSetup, getSetupByWarehouse
} from '../controllers/warehouseController.js';
import { getAllSuppliers, getSupplierById, createSupplier, updateSupplier, deleteSupplier } from '../controllers/supplierController.js';
import { 
  getAllItems, getItemById, createItem, updateItem, deleteItem, getItemsByCategory, getLowStockItems,
  getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory,
  getAllSubcategories, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory,
  getAllHsnSacCodes, getHsnSacCodeById, createHsnSacCode, updateHsnSacCode, deleteHsnSacCode,
  getAllBatchSerialRecords, getBatchSerialRecordById, createBatchSerialRecord, updateBatchSerialRecord, deleteBatchSerialRecord,
  getBatchSerialRecordsByItem, getBatchSerialRecordsByWarehouse
} from '../controllers/itemController.js';
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import { 
  getAllStockTransactions, getStockTransactionById, createStockTransaction, updateStockTransaction, deleteStockTransaction, getStockByWarehouse, getStockByItem,
  getAllStockBatches, getStockBatchById, createStockBatch, updateStockBatch, deleteStockBatch,
  getAllStockInOut, getStockInOutById, createStockInOut, updateStockInOut, deleteStockInOut,
  getAllOpeningStock, getOpeningStockById, createOpeningStock, updateOpeningStock, deleteOpeningStock,
  getAllRealTimeStock, getRealTimeStockById, createRealTimeStock, updateRealTimeStock, deleteRealTimeStock,
  getAllStockTransfers, getStockTransferById, createStockTransfer, updateStockTransfer, deleteStockTransfer
} from '../controllers/stockController.js';
import { 
  getAllPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, 
  getAllPurchaseReturns, getPurchaseReturnById, createPurchaseReturn, updatePurchaseReturn, deletePurchaseReturn,
  getAllCostTracking, getCostTrackingById, createCostTracking, updateCostTracking, deleteCostTracking,
  getAllGoodsReceiptNotes, getGoodsReceiptNoteById, createGoodsReceiptNote, updateGoodsReceiptNote, deleteGoodsReceiptNote,
  getAllPendingOrders, getPendingOrderById, createPendingOrder, updatePendingOrder, deletePendingOrder
} from '../controllers/purchaseController.js';
import { 
  getAllSalesOrders, getSalesOrderById, createSalesOrder, updateSalesOrder, deleteSalesOrder, 
  getAllSalesReturns, getSalesReturnById, createSalesReturn, updateSalesReturn, deleteSalesReturn, 
  getAllDeliveryChallans, getDeliveryChallanById, createDeliveryChallan, updateDeliveryChallan, deleteDeliveryChallan,
  getAllOrderTracking, getOrderTrackingById, createOrderTracking, updateOrderTracking, deleteOrderTracking
} from '../controllers/salesController.js';
import { 
  getAllValuations, getValuationById, createValuation, updateValuation, deleteValuation,
  getAllDeadStock, getDeadStockById, createDeadStock, updateDeadStock, deleteDeadStock,
  getAllCOGS, getCOGSById, createCOGS, updateCOGS, deleteCOGS,
  getAllFifoLifoWeighted, getFifoLifoWeightedById, createFifoLifoWeighted, updateFifoLifoWeighted, deleteFifoLifoWeighted
} from '../controllers/valuationController.js';
import { 
  getAllDamageRecords, getDamageRecordById, createDamageRecord, updateDamageRecord, deleteDamageRecord, 
  getDamageRecordsByWarehouse, getDamageRecordsByStatus,
  getAllDamageReceipts, getDamageReceiptById, createDamageReceipt, updateDamageReceipt, deleteDamageReceipt,
  getAllWriteOffs, getWriteOffById, createWriteOff, updateWriteOff, deleteWriteOff
} from '../controllers/damageController.js';
import { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, deleteInvoice, getInvoicesByCustomer, getInvoicesByPaymentStatus, updatePaymentStatus } from '../controllers/invoiceController.js';
import { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense, getAllIncome, getIncomeById, createIncome, updateIncome, deleteIncome, getExpensesByWarehouse, getIncomeByWarehouse } from '../controllers/financeController.js';
import { getStockSummary, createStockSummary, getItemSales, createItemSales, getStockAging, createStockAging, getValuationReport, createValuationReport, getStockSummaryByWarehouse, getItemSalesByWarehouse, getStockAgingByWarehouse, getValuationReportByWarehouse } from '../controllers/reportController.js';
import { getAllRoles, getRoleById, createRole, updateRole, deleteRole } from '../controllers/roleController.js';
import { getDashboardData } from '../controllers/dashboardController.js';

// Create router instance
export const router = express.Router();

// ================================
// AUTHENTICATION ROUTES
// ================================


router.route('/auth/admin/login').post(loginAdmin);

// ================================
// ROLES & PERMISSIONS ROUTES
// ================================
router.route('/roles').get(verifyToken, getAllRoles).post(verifyToken, createRole);
router.route('/roles/:id').get(verifyToken, getRoleById).put(verifyToken, updateRole).delete(verifyToken, deleteRole);

// ================================
// STAFF MANAGEMENT ROUTES
// ================================

// Staff CRUD operations (staffDocumentUpload parses multipart form + files for document uploads to Cloudinary)
router.route('/staff').get(verifyToken, getAllStaff).post(verifyToken, staffDocumentUpload, createStaff);
router.route('/staff/download-document').get(verifyToken, downloadStaffDocument);
router.route('/staff/:id').get(verifyToken, getStaffById).put(verifyToken, staffDocumentUpload, updateStaff).delete(verifyToken, deleteStaff);

// ================================
// WAREHOUSE MANAGEMENT ROUTES
// ================================

// Warehouse CRUD operations
router.route('/warehouses').get(verifyToken, getAllWarehouses).post(verifyToken, createWarehouse);
router.route('/warehouses/:id').get(verifyToken, getWarehouseById).put(verifyToken, updateWarehouse).delete(verifyToken, deleteWarehouse);
router.route('/warehouses/:warehouseId/bins').post(verifyToken, addBinToWarehouse);

// Bin/Rack Management CRUD operations
router.route('/bin-racks').get(verifyToken, getAllBinRacks).post(verifyToken, createBinRack);
router.route('/bin-racks/:id').get(verifyToken, getBinRackById).put(verifyToken, updateBinRack).delete(verifyToken, deleteBinRack);
router.route('/bin-racks/warehouse/:warehouseId').get(verifyToken, getBinRacksByWarehouse);

// Warehouse Capacity CRUD operations
router.route('/warehouse-capacities').get(verifyToken, getAllWarehouseCapacities).post(verifyToken, createWarehouseCapacity);
router.route('/warehouse-capacities/:id').get(verifyToken, getWarehouseCapacityById).put(verifyToken, updateWarehouseCapacity).delete(verifyToken, deleteWarehouseCapacity);
router.route('/warehouse-capacities/warehouse/:warehouseId').get(verifyToken, getCapacityByWarehouse);

// Warehouse Setup CRUD operations
// router.route('/warehouse-setups').get(verifyToken, getAllWarehouseSetups).post(verifyToken, createWarehouseSetup);
// router.route('/warehouse-setups/:id').get(verifyToken, getWarehouseSetupById).put(verifyToken, updateWarehouseSetup).delete(verifyToken, deleteWarehouseSetup);
// router.route('/warehouse-setups/warehouse/:warehouseId').get(verifyToken, getSetupByWarehouse);

// ================================
// SUPPLIER MANAGEMENT ROUTES
// ================================

// Supplier CRUD operations
router.route('/suppliers').get(verifyToken, getAllSuppliers).post(verifyToken, createSupplier);
router.route('/suppliers/:id').get(verifyToken, getSupplierById).put(verifyToken, updateSupplier).delete(verifyToken, deleteSupplier);

// ================================
// ITEM MANAGEMENT ROUTES
// ================================

// Item CRUD operations
router.route('/items').get(verifyToken, getAllItems).post(verifyToken, createItem);
router.route('/items/:id').get(verifyToken, getItemById).put(verifyToken, updateItem).delete(verifyToken, deleteItem);
router.route('/items/category/:category').get(verifyToken, getItemsByCategory);
router.route('/item/low-stock').get(verifyToken, getLowStockItems);

// Category CRUD operations
router.route('/categories').get(verifyToken, getAllCategories).post(verifyToken, createCategory);
router.route('/categories/:id').get(verifyToken, getCategoryById).put(verifyToken, updateCategory).delete(verifyToken, deleteCategory);

// Subcategory CRUD operations
router.route('/subcategories').get(verifyToken, getAllSubcategories).post(verifyToken, createSubcategory);
router.route('/subcategories/:id').get(verifyToken, getSubcategoryById).put(verifyToken, updateSubcategory).delete(verifyToken, deleteSubcategory);

// HSN/SAC Code CRUD operations
router.route('/hsn-sac-codes').get(verifyToken, getAllHsnSacCodes).post(verifyToken, createHsnSacCode);
router.route('/hsn-sac-codes/:id').get(verifyToken, getHsnSacCodeById).put(verifyToken, updateHsnSacCode).delete(verifyToken, deleteHsnSacCode);

// Batch & Serial Tracking CRUD operations
router.route('/batch-serial').get(verifyToken, getAllBatchSerialRecords).post(verifyToken, createBatchSerialRecord);
router.route('/batch-serial/:id').get(verifyToken, getBatchSerialRecordById).put(verifyToken, updateBatchSerialRecord).delete(verifyToken, deleteBatchSerialRecord);
router.route('/batch-serial/item/:itemId').get(verifyToken, getBatchSerialRecordsByItem);
//router.route('/batch-serial/warehouse/:warehouseId').get(verifyToken, getBatchSerialRecordsByWarehouse);

// ================================
// CUSTOMER MANAGEMENT ROUTES
// ================================

// Customer CRUD operations
router.route('/customers').get(verifyToken, getAllCustomers).post(verifyToken, createCustomer);
router.route('/customers/:id').get(verifyToken, getCustomerById).put(verifyToken, updateCustomer).delete(verifyToken, deleteCustomer);

// ================================
// STOCK MANAGEMENT ROUTES
// ================================

// Stock transaction operations
router.route('/stock/transactions').get(verifyToken, getAllStockTransactions).post(verifyToken, createStockTransaction);
router.route('/stock/transactions/:id').get(verifyToken, getStockTransactionById).put(verifyToken, updateStockTransaction).delete(verifyToken, deleteStockTransaction);
router.route('/stock/warehouse/:warehouse').get(verifyToken, getStockByWarehouse);
router.route('/stock/item/:itemId').get(verifyToken, getStockByItem);

// Stock Batch CRUD operations
router.route('/stock/batches').get(verifyToken, getAllStockBatches).post(verifyToken, createStockBatch);
router.route('/stock/batches/:id').get(verifyToken, getStockBatchById).put(verifyToken, updateStockBatch).delete(verifyToken, deleteStockBatch);

// Stock In/Out CRUD operations
router.route('/stock/in-out').get(verifyToken, getAllStockInOut).post(verifyToken, createStockInOut);
router.route('/stock/in-out/:id').get(verifyToken, getStockInOutById).put(verifyToken, updateStockInOut).delete(verifyToken, deleteStockInOut);

// Opening Stock CRUD operations
router.route('/stock/opening').get(verifyToken, getAllOpeningStock).post(verifyToken, createOpeningStock);
router.route('/stock/opening/:id').get(verifyToken, getOpeningStockById).put(verifyToken, updateOpeningStock).delete(verifyToken, deleteOpeningStock);

// Real-time Stock CRUD operations
router.route('/stock/real-time').get(verifyToken, getAllRealTimeStock).post(verifyToken, createRealTimeStock);
router.route('/stock/real-time/:id').get(verifyToken, getRealTimeStockById).put(verifyToken, updateRealTimeStock).delete(verifyToken, deleteRealTimeStock);

// Stock Transfer CRUD operations
router.route('/stock/transfers').get(verifyToken, getAllStockTransfers).post(verifyToken, createStockTransfer);
router.route('/stock/transfers/:id').get(verifyToken, getStockTransferById).put(verifyToken, updateStockTransfer).delete(verifyToken, deleteStockTransfer);

// ================================
// PURCHASE MANAGEMENT ROUTES
// ================================

// Purchase Orders
router.route('/purchase/orders').get(verifyToken, getAllPurchaseOrders).post(verifyToken, createPurchaseOrder);
router.route('/purchase/orders/:id').get(verifyToken, getPurchaseOrderById).put(verifyToken, updatePurchaseOrder).delete(verifyToken, deletePurchaseOrder);

// Purchase Returns
router.route('/purchase/returns').get(verifyToken, getAllPurchaseReturns).post(verifyToken, createPurchaseReturn);
router.route('/purchase/returns/:id').get(verifyToken, getPurchaseReturnById).put(verifyToken, updatePurchaseReturn).delete(verifyToken, deletePurchaseReturn);

// Cost Tracking
router.route('/purchase/cost-tracking').get(verifyToken, getAllCostTracking).post(verifyToken, createCostTracking);
router.route('/purchase/cost-tracking/:id').get(verifyToken, getCostTrackingById).put(verifyToken, updateCostTracking).delete(verifyToken, deleteCostTracking);

// Goods Receipt Notes
router.route('/purchase/goods-receipt-notes').get(verifyToken, getAllGoodsReceiptNotes).post(verifyToken, createGoodsReceiptNote);
router.route('/purchase/goods-receipt-notes/:id').get(verifyToken, getGoodsReceiptNoteById).put(verifyToken, updateGoodsReceiptNote).delete(verifyToken, deleteGoodsReceiptNote);

// Pending Orders
router.route('/purchase/pending-orders').get(verifyToken, getAllPendingOrders).post(verifyToken, createPendingOrder);
router.route('/purchase/pending-orders/:id').get(verifyToken, getPendingOrderById).put(verifyToken, updatePendingOrder).delete(verifyToken, deletePendingOrder);

// ================================
// SALES & ORDER MANAGEMENT ROUTES
// ================================

// Sales Orders
router.route('/sales/orders').get(verifyToken, getAllSalesOrders).post(verifyToken, createSalesOrder);
router.route('/sales/orders/:id').get(verifyToken, getSalesOrderById).put(verifyToken, updateSalesOrder).delete(verifyToken, deleteSalesOrder);

// Sales Returns
router.route('/sales/returns').get(verifyToken, getAllSalesReturns).post(verifyToken, createSalesReturn);
router.route('/sales/returns/:id').get(verifyToken, getSalesReturnById).put(verifyToken, updateSalesReturn).delete(verifyToken, deleteSalesReturn);

// Delivery Challans
router.route('/sales/delivery-challans').get(verifyToken, getAllDeliveryChallans).post(verifyToken, createDeliveryChallan);
router.route('/sales/delivery-challans/:id').get(verifyToken, getDeliveryChallanById).put(verifyToken, updateDeliveryChallan).delete(verifyToken, deleteDeliveryChallan);

// Order Tracking
router.route('/sales/order-tracking').get(verifyToken, getAllOrderTracking).post(verifyToken, createOrderTracking);
router.route('/sales/order-tracking/:id').get(verifyToken, getOrderTrackingById).put(verifyToken, updateOrderTracking).delete(verifyToken, deleteOrderTracking);

// ================================
// INVENTORY VALUATION & COSTING ROUTES
// ================================

// Valuation
router.route('/valuation').get(verifyToken, getAllValuations).post(verifyToken, createValuation);

// Dead Stock
router.route('/valuation/dead-stock').get(verifyToken, getAllDeadStock).post(verifyToken, createDeadStock);
router.route('/valuation/dead-stock/:id').get(verifyToken, getDeadStockById).put(verifyToken, updateDeadStock).delete(verifyToken, deleteDeadStock);

// COGS
router.route('/valuation/cogs').get(verifyToken, getAllCOGS).post(verifyToken, createCOGS);
router.route('/valuation/cogs/:id').get(verifyToken, getCOGSById).put(verifyToken, updateCOGS).delete(verifyToken, deleteCOGS);

// FIFO/LIFO/Weighted Average
router.route('/valuation/fifo-lifo-weighted').get(verifyToken, getAllFifoLifoWeighted).post(verifyToken, createFifoLifoWeighted);
router.route('/valuation/fifo-lifo-weighted/:id').get(verifyToken, getFifoLifoWeightedById).put(verifyToken, updateFifoLifoWeighted).delete(verifyToken, deleteFifoLifoWeighted);

// Catch-all Valuation by ID must be at the end of valuation routes
router.route('/valuation/:id').get(verifyToken, getValuationById).put(verifyToken, updateValuation).delete(verifyToken, deleteValuation);

// ================================
// DAMAGE TRACKING ROUTES
// ================================

// Damage records
router.route('/damage').get(verifyToken, getAllDamageRecords).post(verifyToken, createDamageRecord);
router.route('/damage/:id').get(verifyToken, getDamageRecordById).put(verifyToken, updateDamageRecord).delete(verifyToken, deleteDamageRecord);
router.route('/damage/warehouse/:warehouseId').get(verifyToken, getDamageRecordsByWarehouse);
router.route('/damage/status/:status').get(verifyToken, getDamageRecordsByStatus);

// Damage Receipts
router.route('/damage/receipts').get(verifyToken, getAllDamageReceipts).post(verifyToken, createDamageReceipt);
router.route('/damage/receipts/:id').get(verifyToken, getDamageReceiptById).put(verifyToken, updateDamageReceipt).delete(verifyToken, deleteDamageReceipt);

// Write-offs
router.route('/damage/write-offs').get(verifyToken, getAllWriteOffs).post(verifyToken, createWriteOff);
router.route('/damage/write-offs/:id').get(verifyToken, getWriteOffById).put(verifyToken, updateWriteOff).delete(verifyToken, deleteWriteOff);

// ================================
// INVOICE MANAGEMENT ROUTES
// ================================

// Invoice operations
router.route('/invoices').get(verifyToken, getAllInvoices).post(verifyToken, createInvoice);
router.route('/invoices/:id').get(verifyToken, getInvoiceById).put(verifyToken, updateInvoice).delete(verifyToken, deleteInvoice);
router.route('/invoices/customer/:customerId').get(verifyToken, getInvoicesByCustomer);
router.route('/invoices/payment-status/:paymentStatus').get(verifyToken, getInvoicesByPaymentStatus);
router.route('/invoices/:id/payment-status').put(verifyToken, updatePaymentStatus);

// ================================
// FINANCE MANAGEMENT ROUTES
// ================================

// Expense operations
router.route('/finance/expenses').get(verifyToken, getAllExpenses).post(verifyToken, createExpense);
router.route('/finance/expenses/:id').get(verifyToken, getExpenseById).put(verifyToken, updateExpense).delete(verifyToken, deleteExpense);
router.route('/finance/expenses/warehouse/:warehouse').get(verifyToken, getExpensesByWarehouse);

// Income operations
router.route('/finance/income').get(verifyToken, getAllIncome).post(verifyToken, createIncome);
router.route('/finance/income/:id').get(verifyToken, getIncomeById).put(verifyToken, updateIncome).delete(verifyToken, deleteIncome);
router.route('/finance/income/warehouse/:warehouse').get(verifyToken, getIncomeByWarehouse);

// ================================
// REPORTING & ANALYTICS ROUTES
// ================================

// Stock Summary Report
router.route('/reports/stock-summary').get(verifyToken, getStockSummary).post(verifyToken, createStockSummary);
router.route('/reports/stock-summary/warehouse/:warehouse').get(verifyToken, getStockSummaryByWarehouse);

// Item-Wise Sales Report
router.route('/reports/item-sales').get(verifyToken, getItemSales).post(verifyToken, createItemSales);
router.route('/reports/item-sales/warehouse/:warehouse').get(verifyToken, getItemSalesByWarehouse);

// Stock Aging Report
router.route('/reports/stock-aging').get(verifyToken, getStockAging).post(verifyToken, createStockAging);
router.route('/reports/stock-aging/warehouse/:warehouse').get(verifyToken, getStockAgingByWarehouse);

// Valuation Report
router.route('/reports/valuation').get(verifyToken, getValuationReport).post(verifyToken, createValuationReport);
router.route('/reports/valuation/warehouse/:warehouse').get(verifyToken, getValuationReportByWarehouse);

// ================================
// DASHBOARD ROUTE
// ================================
router.route('/dashboard').get(verifyToken, getDashboardData);

export default router;

