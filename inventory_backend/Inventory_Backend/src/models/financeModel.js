import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true,
            enum: ['Staff Management', 'Warehouse Management', 'Supplier Relations', 'Item Management', 'Customer Relations', 'Stock Management', 'Purchase Management', 'Sales Management', 'Inventory Valuation', 'Damage Tracking', 'Invoice Management', 'Reporting & Analytics']
        },
        category: {
            type: String,
            required: true,
            enum: ['Staff Training', 'Warehouse Setup', 'Software License', 'Equipment Purchase', 'Travel Expense', 'Setup Cost', 'Compliance Cost', 'Development Cost', 'Maintenance Cost', 'Training Cost', 'System Integration', 'Consulting Services']
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        date: {
            type: Date,
            required: true
        },
        vendor: {
            type: String,
            required: true
        },
        warehouse: {
            type: String,
            required: true,
            enum: ['Main Warehouse', 'Branch Warehouse', 'Storage Facility A', 'Storage Facility B', 'Cold Storage', 'Distribution Center']
        },
        department: {
            type: String,
            required: true,
            enum: ['Staff Management', 'Warehouse Management', 'Supplier Relations', 'Item Management', 'Customer Relations', 'Stock Management', 'Purchase Management', 'Sales Management', 'Inventory Valuation', 'Damage Tracking', 'Invoice Management', 'Reporting & Analytics']
        },
        description: {
            type: String,
            required: true
        },
        paymentMode: {
            type: String,
            enum: ['Bank Transfer', 'Cheque', 'Cash', 'UPI', 'Credit Card'],
            required: true
        },
        approvalStatus: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending'
        },
        approvedBy: {
            type: String
        },
        approvedDate: {
            type: Date
        },
        claimType: {
            type: String,
            enum: ['Advance', 'Reimbursement'],
            default: 'Advance'
        },
        employee: {
            type: String,
            required: true,
            enum: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Gupta', 'Rohit Singh', 'Anita Desai', 'Vikram Joshi', 'Kavita Reddy', 'Arjun Mehta', 'Deepika Nair', 'Suresh Kumar', 'Meera Iyer']
        },
        attachment: {
            type: String
        },
        status: {
            type: String,
            enum: ['Active', 'Cancelled'],
            default: 'Active'
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const incomeSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        incomeType: {
            type: String,
            required: true,
            enum: ['Sales Revenue', 'Service Revenue', 'Training Services', 'Consulting Services', 'Rental Income', 'Interest Income', 'Commission Income', 'Other Income', 'Refund', 'Discount Received', 'Miscellaneous Income', 'Investment Income']
        },
        date: {
            type: Date,
            required: true
        },
        receivedFrom: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'INR'
        },
        paymentMode: {
            type: String,
            enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque', 'Credit Card'],
            required: true
        },
        referenceNo: {
            type: String
        },
        status: {
            type: String,
            enum: ['Received', 'Pending'],
            default: 'Pending'
        },
        warehouse: {
            type: String,
            required: true,
            enum: ['Main Warehouse', 'Branch Warehouse', 'Storage Facility A', 'Storage Facility B', 'Cold Storage', 'Distribution Center']
        },
        department: {
            type: String,
            required: true,
            enum: ['Sales', 'Services', 'Training', 'Consulting', 'Finance', 'Operations', 'Marketing', 'Customer Service', 'Administration', 'Other']
        },
        description: {
            type: String,
            required: true
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const ExpenseModel = mongoose.model('Expense', expenseSchema);
const IncomeModel = mongoose.model('Income', incomeSchema);

export { ExpenseModel, IncomeModel };
