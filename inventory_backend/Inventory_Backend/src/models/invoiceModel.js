import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },
        customerName: {
            type: String,
            required: true
        },
        customerEmail: {
            type: String,
            required: true
        },
        customerPhone: {
            type: String,
            required: true
        },
        billingAddress: {
            type: String,
            required: true
        },
        supplierName: {
            type: String
        },
        supplierEmail: {
            type: String
        },
        supplierPhone: {
            type: String
        },
        supplierAddress: {
            type: String
        },
        invoiceDate: {
            type: Date,
            required: true
        },
        dueDate: {
            type: Date,
            required: true
        },
        items: [{
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            unitPrice: {
                type: Number,
                required: true
            },
            total: {
                type: Number,
                required: true
            }
        }],
        subtotal: {
            type: Number,
            required: true
        },
        taxRate: {
            type: Number,
            default: 18
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
            enum: ['Paid', 'Pending', 'Overdue'],
            default: 'Pending'
        },
        paymentTerms: {
            type: String,
            enum: ['Net 7', 'Net 15', 'Net 30', 'Net 45', 'Net 60'],
            default: 'Net 30'
        },
        notes: {
            type: String
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
export default InvoiceModel;
