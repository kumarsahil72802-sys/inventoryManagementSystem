import mongoose from "mongoose";

const stockSummarySchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        warehouse: {
            type: String,
            required: true
        },
        currentStock: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        costPrice: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        minStock: {
            type: Number,
            required: true
        },
        maxStock: {
            type: Number,
            required: true
        },
        stockStatus: {
            type: String,
            enum: ['In Stock', 'Low Stock', 'Out of Stock', 'Overstock'],
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const itemSalesSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        period: {
            type: String,
            required: true
        },
        totalQuantitySold: {
            type: Number,
            required: true
        },
        totalRevenue: {
            type: Number,
            required: true
        },
        averagePrice: {
            type: Number,
            required: true
        },
        totalOrders: {
            type: Number,
            required: true
        },
        topCustomer: {
            type: String
        },
        warehouse: {
            type: String,
            required: true
        },
        salesTrend: {
            type: String,
            enum: ['Increasing', 'Decreasing', 'Stable'],
            required: true
        }
    },
    { timestamps: true }
);

const stockAgingSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        warehouse: {
            type: String,
            required: true
        },
        currentStock: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        costPrice: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        lastMovementDate: {
            type: Date,
            required: true
        },
        daysSinceLastMovement: {
            type: Number,
            required: true
        },
        agingCategory: {
            type: String,
            enum: ['0-30 days', '31-60 days', '61-90 days', '91-180 days', '181-365 days', 'Over 1 year'],
            required: true
        },
        batchNumber: {
            type: String
        },
        expiryDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Active', 'Slow Moving', 'Dead Stock'],
            required: true
        }
    },
    { timestamps: true }
);

const valuationReportSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        itemName: {
            type: String,
            required: true
        },
        sku: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        warehouse: {
            type: String,
            required: true
        },
        valuationMethod: {
            type: String,
            enum: ['FIFO', 'LIFO', 'Weighted Average', 'Specific Identification'],
            required: true
        },
        currentStock: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        averageCost: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        lastPurchasePrice: {
            type: Number,
            required: true
        },
        lastSalePrice: {
            type: Number,
            required: true
        },
        profitMargin: {
            type: Number,
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const StockSummaryModel = mongoose.model('StockSummary', stockSummarySchema);
const ItemSalesModel = mongoose.model('ItemSales', itemSalesSchema);
const StockAgingModel = mongoose.model('StockAging', stockAgingSchema);
const ValuationReportModel = mongoose.model('ValuationReport', valuationReportSchema);

export { StockSummaryModel, ItemSalesModel, StockAgingModel, ValuationReportModel };

