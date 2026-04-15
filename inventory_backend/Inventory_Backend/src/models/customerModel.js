import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        },
        companyName: {
            type: String
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        gstNumber: {
            type: String
        },
        panNumber: {
            type: String
        },
        creditLimit: {
            type: Number,
            default: 0
        },
        paymentTerms: {
            type: String,
            enum: ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Cash'],
            default: 'Net 30'
        },
        customerType: {
            type: String,
            enum: ['Retail', 'Wholesale', 'Corporate', 'Individual'],
            default: 'Retail'
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Blocked'],
            default: 'Active'
        },
        totalOrders: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const CustomerModel = mongoose.model('Customer', customerSchema);
export default CustomerModel;

