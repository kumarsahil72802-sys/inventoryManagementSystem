import mongoose, { Schema } from "mongoose";

// ================================
// STOCK BATCH SCHEMA
// ================================
const stockBatchSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        batchNumber: {
            type: String,
            required: true
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        binId: {
            type: String
        },
        quantity: {
            type: Number,
            required: true
        },
        availableQuantity: {
            type: Number,
            required: true
        },
        reservedQuantity: {
            type: Number,
            default: 0
        },
        purchaseDate: {
            type: Date,
            required: true
        },
        expiryDate: {
            type: Date
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier'
        },
        purchaseOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder'
        },
        purchasePrice: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        costPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Expired', 'Depleted', 'Damaged', 'Returned'],
            default: 'Active'
        },
        isExpired: {
            type: Boolean,
            default: false
        },
        daysToExpiry: {
            type: Number
        },
        notes: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        }
    },
    { timestamps: true }
);

// ================================
// STOCK IN/OUT SCHEMA
// ================================
const stockInOutSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        // warehouseId: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse',
        //     required: true
        // },
        transactionType: {
            type: String,
            enum: ['Stock In', 'Stock Out', 'Transfer In', 'Transfer Out', 'Adjustment'],
            required: true
        },

        perPiecePrice:{
            type:String
        },
        quantity: {
            type: Number,
            required: true
        },

        totalCost:{
            type:String
        },
        supplierId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
        },
        invoice:{
            type:String
        },
        entryDate:{
            type:Date
        },
        paymentStatus:{
            type:String,
            enum:["paid","pending","overdue"]
        }
        // unit: {
        //     type: String,
        //     required: true
        // },
        // batchNumber: {
        //     type: String
        // },
        // serialNumbers: [String],
        // referenceNumber: {
        //     type: String
        // },
        // referenceType: {
        //     type: String,
        //     enum: ['Purchase Order', 'Sales Order', 'Transfer', 'Adjustment', 'Return', 'Damage']
        // },
        // referenceId: {
        //     type: mongoose.Schema.Types.ObjectId
        // },
        // fromWarehouse: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse'
        // },
        // toWarehouse: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse'
        // },
        // costPrice: {
        //     type: Number
        // },
        // sellingPrice: {
        //     type: Number
        // },
        // totalValue: {
        //     type: Number
        // },
        // reason: {
        //     type: String
        // },
        // performedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff',
        //     required: true
        // },
        // status: {
        //     type: String,
        //     enum: ['Pending', 'Completed', 'Cancelled'],
        //     default: 'Completed'
        // },
        // notes: {
        //     type: String
        // }
    },
    { timestamps: true }
);

// ================================
// OPENING STOCK SCHEMA
// ================================
const openingStockSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        supplierId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Supplier'
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: String,
            required: true
        },
        openingDate: {
            type: Date,
            required: true
        },
        // costPrice: {
        //     type: Number,
        //     required: true
        // },
        // sellingPrice: {
        //     type: Number,
        //     required: true
        // },
        // totalValue: {
        //     type: Number,
        //     required: true
        // },
        // batchNumber: {
        //     type: String
        // },
        // serialNumbers: [String],
        // expiryDate: {
        //     type: Date
        // },
        
        // financialYear: {
        //     type: String,
        //     required: true
        // },
        // isVerified: {
        //     type: Boolean,
        //     default: false
        // },
        // verifiedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff'
        // },
        // verifiedAt: {
        //     type: Date
        // },
        // notes: {
        //     type: String
        // },
        // createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff',
        //     required: true
        // }
    },
    { timestamps: true }
);

// ================================
// REAL-TIME STOCK SCHEMA
// ================================
const realTimeStockSchema = new mongoose.Schema(
    {
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        // binId: {
        //     type: String
        // },
        currentStock: {
            type: Number,
            required: true
        },
        availableStock: {
            type: Number,
            required: true
        },
        reservedStock: {
            type: Number,
            default: 0
        },
        movement:{
            type:String,
            enum:["Stock In","Stock Out","Stock Transfer"]
        },
        movementQuantity:{
            type:Number
        }
        // orderedStock: {
        //     type: Number,
        //     default: 0
        // },
        // unit: {
        //     type: String,
        //     required: true
        // },
        // lastUpdated: {
        //     type: Date,
        //     default: Date.now
        // },
        // lastTransactionId: {
        //     type: mongoose.Schema.Types.ObjectId
        // },
        // lastTransactionType: {
        //     type: String,
        //     enum: ['Stock In', 'Stock Out', 'Transfer', 'Adjustment']
        // },
        // isLowStock: {
        //     type: Boolean,
        //     default: false
        // },
        // isOutOfStock: {
        //     type: Boolean,
        //     default: false
        // },
        // reorderLevel: {
        //     type: Number,
        //     default: 0
        // },
        // maxStockLevel: {
        //     type: Number,
        //     default: 1000
        // }
    },
    { timestamps: true }
);

// ================================
// STOCK TRANSFER SCHEMA
// ================================
const stockTransferSchema = new mongoose.Schema(
    {
        transferNumber: {
            type: String,
            required: true,
            unique: true
        },
        fromWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        toWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        items: [{
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            batchNumber: {
                type: String
            },
            serialNumbers: [String],
            costPrice: {
                type: Number,
                required: true
            },
            totalValue: {
                type: Number,
                required: true
            }
        }],
        totalValue: {
            type: Number,
            required: true
        },
        transferDate: {
            type: Date,
            required: true
        },
        expectedDeliveryDate: {
            type: Date
        },
        actualDeliveryDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        reason: {
            type: String
        },
        notes: {
            type: String
        },
        initiatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        approvedAt: {
            type: Date
        },
        receivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        receivedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

// ================================
// STOCK SCHEMA (UPDATED)
// ================================
const stockSchema = new mongoose.Schema(
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
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        transactionType: {
            type: String,
            enum: ['Stock In', 'Stock Out', 'Stock Transfer', 'Adjustment', 'Opening Stock'],
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        batchNumber: {
            type: String
        },
        serialNumber: {
            type: String
        },
        expiryDate: {
            type: Date
        },
        referenceNumber: {
            type: String
        },
        reason: {
            type: String
        },
        fromWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        toWarehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse'
        },
        costPrice: {
            type: Number
        },
        totalValue: {
            type: Number
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Completed', 'Cancelled'],
            default: 'Completed'
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// ================================
// MODELS EXPORT
// ================================
const StockModel = mongoose.model('Stock', stockSchema);
const StockBatchModel = mongoose.model('StockBatch', stockBatchSchema);
const StockInOutModel = mongoose.model('StockInOut', stockInOutSchema);
const OpeningStockModel = mongoose.model('OpeningStock', openingStockSchema);
const RealTimeStockModel = mongoose.model('RealTimeStock', realTimeStockSchema);
const StockTransferModel = mongoose.model('StockTransfer', stockTransferSchema);

export default StockModel;
export { StockBatchModel, StockInOutModel, OpeningStockModel, RealTimeStockModel, StockTransferModel };

