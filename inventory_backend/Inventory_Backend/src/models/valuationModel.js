import mongoose from "mongoose";

// ================================
// FIFO/LIFO/WEIGHTED AVERAGE SCHEMA
// ================================
const fifoLifoWeightedSchema = new mongoose.Schema(
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
        valuationMethod: {
            type: String,
            enum: ['FIFO', 'LIFO', 'Weighted Average'],
            required: true
        },
        period: {
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        },
        batches: [{
            batchNumber: String,
            purchaseDate: Date,
            quantity: Number,
            costPrice: Number,
            remainingQuantity: Number,
            usedQuantity: Number,
            expiryDate: Date
        }],
        totalStock: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        averageCost: {
            type: Number,
            required: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
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
// VALUATION SCHEMA (UPDATED)
// ================================
const valuationSchema = new mongoose.Schema(
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
        valuationMethod: {
            type: String,
            enum: ['FIFO', 'LIFO', 'Weighted Average', 'Specific Identification'],
            required: true
        },
        currentStock: {
            type: Number,
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
        lastUpdated: {
            type: Date,
            default: Date.now
        },
        batchDetails: [{
            batchNumber: String,
            quantity: Number,
            costPrice: Number,
            expiryDate: Date,
            remainingQuantity: Number
        }],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        }
    },
    { timestamps: true }
);

// ================================
// DEAD STOCK SCHEMA (UPDATED)
// ================================
const deadStockSchema = new mongoose.Schema(
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
        currentStock: {
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
        costPrice: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Identified', 'Under Review', 'Disposed', 'Transferred'],
            default: 'Identified'
        },
        actionTaken: {
            type: String
        },
        notes: {
            type: String
        },
        identifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        reviewedAt: {
            type: Date
        }
    },
    { timestamps: true }
);

// ================================
// COGS SCHEMA (UPDATED)
// ================================
const cogsSchema = new mongoose.Schema(
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
        period: {
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            }
        },
        openingStock: {
            quantity: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        purchases: {
            quantity: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        closingStock: {
            quantity: {
                type: Number,
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        },
        cogs: {
            type: Number,
            required: true
        },
        salesQuantity: {
            type: Number,
            required: true
        },
        averageCost: {
            type: Number,
            required: true
        },
        grossProfit: {
            type: Number,
            required: true
        },
        grossProfitMargin: {
            type: Number,
            required: true
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
// MODELS EXPORT
// ================================
const ValuationModel = mongoose.model('Valuation', valuationSchema);
const DeadStockModel = mongoose.model('DeadStock', deadStockSchema);
const COGSModel = mongoose.model('COGS', cogsSchema);
const FifoLifoWeightedModel = mongoose.model('FifoLifoWeighted', fifoLifoWeightedSchema);

export { ValuationModel, DeadStockModel, COGSModel, FifoLifoWeightedModel };

