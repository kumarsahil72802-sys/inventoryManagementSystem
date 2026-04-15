import mongoose from "mongoose";

// ================================
// COST TRACKING SCHEMA
// ================================
const costTrackingSchema = new mongoose.Schema(
    {
        purchaseOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder',
            required: true
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        baseCost: {
            type: Number,
            required: true
        },
        additionalCosts: [{
            costType: {
                type: String,
                enum: ['Freight', 'Insurance', 'Customs', 'Handling', 'Storage', 'Other']
            },
            amount: {
                type: Number,
                required: true
            },
            description: String
        }],
        totalCost: {
            type: Number,
            required: true
        },
        costPerUnit: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        exchangeRate: {
            type: Number,
            default: 1
        },
        trackingDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
            default: 'Pending'
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
// GOODS RECEIPT NOTE SCHEMA
// ================================
const goodsReceiptNoteSchema = new mongoose.Schema(
    {
        grnNumber: {
            type: String,
            required: true,
            unique: true
        },
        purchaseOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder',
            required: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        receiptDate: {
            type: Date,
            required: true
        },
        items: [{
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
            orderedQuantity: {
                type: Number,
                required: true
            },
            receivedQuantity: {
                type: Number,
                required: true
            },
            acceptedQuantity: {
                type: Number,
                required: true
            },
            rejectedQuantity: {
                type: Number,
                default: 0
            },
            unit: {
                type: String,
                required: true
            },
            costPrice: {
                type: Number,
                required: true
            },
            totalAmount: {
                type: Number,
                required: true
            },
            batchNumber: {
                type: String
            },
            serialNumbers: [String],
            expiryDate: {
                type: Date
            },
            qualityStatus: {
                type: String,
                enum: ['Accepted', 'Rejected', 'Partially Accepted'],
                default: 'Accepted'
            },
            rejectionReason: {
                type: String
            }
        }],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Partially Received', 'Completed', 'Cancelled'],
            default: 'Pending'
        },
        receivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        verifiedAt: {
            type: Date
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// ================================
// PENDING ORDERS SCHEMA
// ================================
const pendingOrderSchema = new mongoose.Schema(
    {
        purchaseOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder',
            required: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        orderDate: {
            type: Date,
            required: true
        },
        expectedDate: {
            type: Date,
            required: true
        },
        overdueDays: {
            type: Number,
            default: 0
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Urgent'],
            default: 'Medium'
        },
        totalValue: {
            type: Number,
            required: true
        },
        pendingValue: {
            type: Number,
            required: true
        },
        receivedValue: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['Pending', 'Partially Received', 'Overdue', 'Cancelled'],
            default: 'Pending'
        },
        lastFollowUp: {
            type: Date
        },
        nextFollowUp: {
            type: Date
        },
        followUpNotes: [{
            date: Date,
            note: String,
            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            }
        }],
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

// ================================
// PURCHASE ORDER SCHEMA (UPDATED)
// ================================
const purchaseOrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        supplierName: {
            type: String,
            required: true
        },
        orderDate: {
            type: Date,
            required: true
        },
        // expectedDate: {
        //     type: Date,
        //     required: true
        // },
        // items: [{
        //     itemId: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Item',
        //         required: true
        //     },
        //     itemName: {
        //         type: String,
        //         required: true
        //     },
        //     sku: {
        //         type: String,
        //         required: true
        //     },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: String,
                required: true
            },
            // costPrice: {
            //     type: Number,
            //     required: true
            // },
            // totalAmount: {
            //     type: Number,
            //     required: true
            // },
        
        // total: {
        //     type: Number,
        //     required: true
        // // },
        // taxAmount: {
        //     type: Number,
        //     required: true
        // },
        totalAmount: {
            type: Number,
            required: true
        },
        // status: {
        //     type: String,
        //     enum: ['Pending', 'Approved', 'Partially Received', 'Completed', 'Cancelled'],
        //     default: 'Pending'
        // },
        // warehouse: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse',
        //     required: true
        // },
        paymentTerms:{
            type:String,
            enum:['Net 15','Net 30','Net 60','Cash On Delivery','Advance Payment']
        },
        notes: {
            type: String
        },
        // createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff',
        //     required: true
        // },
        // approvedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff'
        // },
        // approvedAt: {
        //     type: Date
        // }
    },
    { timestamps: true }
);

// ================================
// PURCHASE RETURN SCHEMA (UPDATED)
// ================================
const purchaseReturnSchema = new mongoose.Schema(
    {
        // returnNumber: {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        originalOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder',
            required: true
        },
        supplierId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true
        },
        // supplierName: {
        //     type: String,
        //     required: true
        // },
        returnDate: {
            type: Date,
            required: true
        },
            itemId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Item',
                required: true
            },
            itemName: {
                type: String,
                required: true
            },
            // sku: {
            //     type: String,
            //     required: true
            // },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: String,
                required: true
            },
            // costPrice: {
            //     type: Number,
            //     required: true
            // },
            totalAmount: {
                type: Number,
                required: true
            },
        reason: {
                type: String,
                required: true
            },
        // subtotal: {
        //     type: Number,
        //     required: true
        // },
        // taxAmount: {
        //     type: Number,
        //     required: true
        // },
        // totalAmount: {
        //     type: Number,
        //     required: true
        // },
        // status: {
        //     type: String,
        //     enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
        //     default: 'Pending'
        // },
        // warehouse: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse',
        //     required: true
        // },
        notes: {
            type: String
        },
        // createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff',
        //     required: true
        // },
        // approvedBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff'
        // },
        // approvedAt: {
        //     type: Date
        // }
    },
    { timestamps: true }
);

// ================================
// MODELS EXPORT
// ================================
const PurchaseOrderModel = mongoose.model('PurchaseOrder', purchaseOrderSchema);
const PurchaseReturnModel = mongoose.model('PurchaseReturn', purchaseReturnSchema);
const CostTrackingModel = mongoose.model('CostTracking', costTrackingSchema);
const GoodsReceiptNoteModel = mongoose.model('GoodsReceiptNote', goodsReceiptNoteSchema);
const PendingOrderModel = mongoose.model('PendingOrder', pendingOrderSchema);

export { PurchaseOrderModel, PurchaseReturnModel, CostTrackingModel, GoodsReceiptNoteModel, PendingOrderModel };

