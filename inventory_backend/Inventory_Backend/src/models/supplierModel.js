import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        contactPerson:{
            type:String
        },

        companyName: {
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
            type: String,
            required: true
        },
        supplierType:{
            type:String,
            enum:[ "Electronics",
    "Furniture",
    "Kitchenware",
    "Clothing",
    "Books",
    "Home & Garden",
    "Sports",
    "Automotive",
    "Health & Beauty"]
        },
        panNumber: {
            type: String,
            required: true
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
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Blocked'],
            default: 'Active'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 3
        },
        accountHolderName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        IFSC: { type: String },
        bankBranch: { type: String },
        bankLocation: { type: String }
    },
    { timestamps: true }
);

const SupplierModel = mongoose.model('Supplier', supplierSchema);
export default SupplierModel;

