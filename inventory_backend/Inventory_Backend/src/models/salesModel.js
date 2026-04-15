import mongoose from "mongoose";

// ================================
// ORDER TRACKING SCHEMA
// ================================
const orderTrackingSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SalesOrder',
            required: true
        },
        orderNumber: {
            type: String,
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        trackingNumber: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: ['Order Placed', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
            default: 'Order Placed'
        },
        currentLocation: {
            type: String
        },
        estimatedDelivery: {
            type: Date
        },
        actualDelivery: {
            type: Date
        },
        trackingHistory: [{
            status: {
                type: String,
                required: true
            },
            location: String,
            timestamp: {
                type: Date,
                default: Date.now
            },
            description: String,
            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            }
        }],
        carrier: {
            name: String,
            trackingNumber: String,
            contact: String
        },
        deliveryAddress: {
            type: String,
            required: true
        },
        specialInstructions: {
            type: String
        },
        isDelivered: {
            type: Boolean,
            default: false
        },
        deliveryProof: {
            signature: String,
            image: String,
            deliveredBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            deliveredAt: Date
        }
    },
    { timestamps: true }
);

// ================================
// SALES ORDER SCHEMA (UPDATED)
// ================================
const salesOrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        customerName: {
            type: String,
            required: true
        },
        orderDate: {
            type: Date,
            required: true
        },
        deliveryDate: {
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
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            sellingPrice: {
                type: Number,
                required: true
            },
            discount: {
                type: Number,
                default: 0
            },
            totalAmount: {
                type: Number,
                required: true
            }
        }],
        subtotal: {
            type: Number,
            required: true
        },
        discountAmount: {
            type: Number,
            default: 0
        },
        taxAmount: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Pending'
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Partial', 'Paid'],
            default: 'Pending'
        },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        shippingAddress: {
            type: String,
            required: true
        },
        notes: {
            type: String
        },
        createdBy: {
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
        }
    },
    { timestamps: true }
);

// ================================
// SALES RETURN SCHEMA (UPDATED)
// ================================
const salesReturnSchema = new mongoose.Schema(
    {
        returnNumber: {
            type: String,
            required: true,
            unique: true
        },
        originalOrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SalesOrder',
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        customerName: {
            type: String,
            required: true
        },
        returnDate: {
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
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            },
            sellingPrice: {
                type: Number,
                required: true
            },
            totalAmount: {
                type: Number,
                required: true
            },
            reason: {
                type: String,
                required: true
            }
        }],
        subtotal: {
            type: Number,
            required: true
        },
        taxAmount: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Completed', 'Cancelled'],
            default: 'Pending'
        },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        notes: {
            type: String
        },
        createdBy: {
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
        }
    },
    { timestamps: true }
);

// ================================
// DELIVERY CHALLAN SCHEMA (UPDATED)
// ================================
const deliveryChallanSchema = new mongoose.Schema(
    {
        challanNumber: {
            type: String,
            required: true,
            unique: true
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SalesOrder',
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true
        },
        customerName: {
            type: String,
            required: true
        },
        deliveryDate: {
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
            quantity: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            }
        }],
        deliveryAddress: {
            type: String,
            required: true
        },
        driverName: {
            type: String,
            required: true
        },
        vehicleNumber: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Dispatched', 'In Transit', 'Delivered', 'Returned'],
            default: 'Dispatched'
        },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        notes: {
            type: String
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        deliveredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        deliveredAt: {
            type: Date
        }
    },
    { timestamps: true }
);

// ================================
// MODELS EXPORT
// ================================
const SalesOrderModel = mongoose.model('SalesOrder', salesOrderSchema);
const SalesReturnModel = mongoose.model('SalesReturn', salesReturnSchema);
const DeliveryChallanModel = mongoose.model('DeliveryChallan', deliveryChallanSchema);
const OrderTrackingModel = mongoose.model('OrderTracking', orderTrackingSchema);

export { SalesOrderModel, SalesReturnModel, DeliveryChallanModel, OrderTrackingModel };

