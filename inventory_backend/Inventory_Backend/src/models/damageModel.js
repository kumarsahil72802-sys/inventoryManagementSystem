import mongoose from "mongoose";

// ================================
// DAMAGE RECEIPTS SCHEMA
// ================================
const damageReceiptSchema = new mongoose.Schema(
    {
        receiptNumber: {
            type: String,
            required: true,
            unique: true
        },
        damageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Damage',
            required: true
        },
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
        receiptDate: {
            type: Date,
            required: true
        },
        damagedQuantity: {
            type: Number,
            required: true
        },
        unitCost: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        damageDescription: {
            type: String,
            required: true
        },
        evidence: [{
            type: {
                type: String,
                enum: ['Photo', 'Video', 'Document', 'Other']
            },
            url: String,
            description: String
        }],
        witnesses: [{
            name: String,
            designation: String,
            contact: String
        }],
        status: {
            type: String,
            enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected'],
            default: 'Draft'
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        reviewedAt: {
            type: Date
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
// WRITE-OFF SCHEMA
// ================================
const writeOffSchema = new mongoose.Schema(
    {
        writeOffNumber: {
            type: String,
            required: true,
            unique: true
        },
        damageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Damage',
            required: true
        },
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
        writeOffDate: {
            type: Date,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitCost: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        writeOffReason: {
            type: String,
            enum: ['Damaged', 'Expired', 'Obsolete', 'Theft', 'Lost', 'Quality Issue', 'Other'],
            required: true
        },
        reasonDescription: {
            type: String,
            required: true
        },
        disposalMethod: {
            type: String,
            enum: ['Destroyed', 'Donated', 'Recycled', 'Returned to Supplier', 'Sold as Scrap', 'Other'],
            required: true
        },
        disposalDetails: {
            type: String
        },
        financialImpact: {
            type: String,
            enum: ['Write-off', 'Insurance Claim', 'Supplier Credit', 'Partial Recovery'],
            required: true
        },
        recoveryAmount: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
            default: 'Pending'
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        approvedAt: {
            type: Date
        },
        completedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        completedAt: {
            type: Date
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
// DAMAGE SCHEMA (UPDATED)
// ================================
const damageSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        productName: {
            type: String,
            required: true
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        damageDate: {
            type: Date,
            required: true
        },
        damageType: {
            type: String,
            enum: ['Physical Damage', 'Water Damage', 'Breakage', 'Fire Damage', 'Theft', 'Expired', 'Quality Issue', 'Handling Error'],
            required: true
        },
        damagedQuantity: {
            type: Number,
            required: true
        },
        unitCost: {
            type: Number,
            required: true
        },
        totalValue: {
            type: Number,
            required: true
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true
        },
        warehouse: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Under Investigation', 'Approved', 'Rejected', 'Resolved'],
            default: 'Pending'
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Critical'],
            default: 'Medium'
        },
        investigationDetails: {
            investigator: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            findings: String,
            recommendations: String,
            completedAt: Date
        },
        resolution: {
            actionTaken: String,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Staff'
            },
            resolvedAt: Date,
            preventiveMeasures: String
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
const DamageModel = mongoose.model('Damage', damageSchema);
const DamageReceiptModel = mongoose.model('DamageReceipt', damageReceiptSchema);
const WriteOffModel = mongoose.model('WriteOff', writeOffSchema);

export default DamageModel;
export { DamageReceiptModel, WriteOffModel };
