import mongoose from "mongoose";

// ================================
// CATEGORY SCHEMA
// ================================
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        // code: {
        //     type: String,
        //     // required: true,
        //     // unique: true
        // },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },
        // parentCategory: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Category',
        //     default: null
        // },
        // level: {
        //     type: Number,
        //     default: 0
        // },
        // imageUrl: {
        //     type: String
        // },
        // isActive: {
        //     type: Boolean,
        //     default: true
        // },
        // sortOrder: {
        //     type: Number,
        //     default: 0
        // },
        // attributes: [{
        //     name: String,
        //     type: {
        //         type: String,
        //         enum: ['text', 'number', 'boolean', 'date', 'dropdown']
        //     },
        //     required: Boolean,
        //     options: [String]
        // }],
        // createdBy: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Staff',
        //     required: true
        // }
    },
    { timestamps: true }
);

// ================================
// SUBCATEGORY SCHEMA
// ================================
const subcategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        // code: {
        //     type: String,
        //     required: true,
        //     unique: true
        // },
        description: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },
    //     imageUrl: {
    //         type: String
    //     },
    //     isActive: {
    //         type: Boolean,
    //         default: true
    //     },
    //     sortOrder: {
    //         type: Number,
    //         default: 0
    //     },
    //     attributes: [{
    //         name: String,
    //         type: {
    //             type: String,
    //             enum: ['text', 'number', 'boolean', 'date', 'dropdown']
    //         },
    //         required: Boolean,
    //         options: [String]
    //     }],
    //     createdBy: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Staff',
    //         required: true
    //     }
    },
    { timestamps: true }
);

// ================================
// HSN/SAC CODE SCHEMA
// ================================
const hsnSacSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            required: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: true
        },
        taxRate:{
            type:Number
        },
        // type: {
        //     type: String,
        //     enum: ['HSN', 'SAC'],
        //     required: true
        // },
        // gstRate: {
        //     type: Number,
        //     required: true
        // },
        // cgstRate: {
        //     type: Number,
        //     required: true
        // },
        // sgstRate: {
        //     type: Number,
        //     required: true
        // },
        // igstRate: {
        //     type: Number,
        //     required: true
        // },
        // cessRate: {
        //     type: Number,
        //     default: 0
        // },
        // isActive: {
        //     type: Boolean,
        //     default: true
        // },
        // effectiveFrom: {
        //     type: Date,
        //     required: true
        // },
        // effectiveTo: {
        //     type: Date
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
// BATCH & SERIAL TRACKING SCHEMA
// ================================
const batchSerialSchema = new mongoose.Schema(
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
            serialNumber: {
                type: String,
                required: true
            },
            // status: {
            //     type: String,
            //     enum: ['Available', 'Sold', 'Damaged', 'Returned', 'Transferred'],
            //     default: 'Available'
            // },
            purchaseDate: {
                type: Date,
                required: true
            },
            expiryDate: {
                type: Date
            },
            // purchasePrice: {
            //     type: Number,
            //     required: true
            // },
            // sellingPrice: {
            //     type: Number,
            //     required: true
            // },
            supplier: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Supplier'
            },
            // warehouse: {
            //     type: mongoose.Schema.Types.ObjectId,
            //     ref: 'Warehouse',
            //     required: true
            // },
            // binLocation: {
            //     type: String
            // },
            // notes: {
            //     type: String
            // }
        
        totalQuantity: {
            type: Number,
            required: true
        },
        // availableQuantity: {
        //     type: Number,
        //     required: true
        // },
        // soldQuantity: {
        //     type: Number,
        //     default: 0
        // },
        // damagedQuantity: {
        //     type: Number,
        //     default: 0
        // },
        // purchaseDate: {
        //     type: Date,
        //     required: true
        // },
        // expiryDate: {
        //     type: Date
        // },
        // supplier: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Supplier'
        // },
        // warehouse: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Warehouse',
        //     required: true
        // },
        // purchasePrice: {
        //     type: Number,
        //     required: true
        // },
        // sellingPrice: {
        //     type: Number,
        //     required: true
        // },
        // isActive: {
        //     type: Boolean,
        //     default: true
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
// ITEM SCHEMA (UPDATED)
// ================================
const itemSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            unique: true,
            sparse: true
        },
        productName: {
            type: String,
            required: true
        },
        SKUcode: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String
        },
        Barcode: {
            type: String,
            unique: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subcategory',
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        unitOfMeasure: {
            type: String,
            required: true,
            enum: ['Pieces', 'Kg', 'Liter', 'Liters', 'Box', 'Pack', 'Meter', 'Meters', 'Gram']
        },
        description: {
            type: String,
            required: true
        },
        purchasePrice: {
            type: Number,
            required: true
        },
        sellingPrice: {
            type: Number,
            required: true
        },
        discountType:{
            type:String
        },
        discount: {
            type: Number,
            default: 0
        },
        taxRate: {
            type: Number,
            required: true
        },
        hsnCode: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'HsnSac'
        },
        hsnCodeString: {
            type: String
        },
        warehouseName: {
            type: String
        },
        batchNumber: {
            type: String
        },
        serialNumber: {
            type: String
        },
        productImageUrl: {
            type: String
        },
        hasVariants: {
            type: Boolean,
            default: false
        },
        variants: [{
            id: String,
            variantName: String,
            sku: String,
            price: Number,
            discountPrice: Number,
            stock: Number,
            batchNumber:String,
            serialNumber:String,
            attributes: mongoose.Schema.Types.Mixed
        }],
        stock: {
            type: Number,
            default: 0
        },
        minStock: {
            type: Number,
            default: 0
        },
        maxStock: {
            type: Number,
            default: 1000
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Discontinued'],
            default: 'Active'
        },
        // Additional fields for comprehensive item management
        weight: {
            value: Number,
            unit: {
                type: String,
                enum: ['g', 'kg', 'lb', 'oz'],
                default: 'kg'
            }
        },
        dimensions: {
            length: Number,
            width: Number,
            height: Number,
            unit: {
                type: String,
                enum: ['cm', 'm', 'ft', 'in'],
                default: 'cm'
            }
        },
        isSerialized: {
            type: Boolean,
            default: false
        },
        isBatchTracked: {
            type: Boolean,
            default: false
        },
        shelfLife: {
            value: Number,
            unit: {
                type: String,
                enum: ['days', 'months', 'years'],
                default: 'days'
            }
        },
        reorderPoint: {
            type: Number,
            default: 0
        },
        reorderQuantity: {
            type: Number,
            default: 0
        },
        tags: [String],
        specifications: mongoose.Schema.Types.Mixed,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        }
    },
    { timestamps: true }
);

// ================================
// MODELS EXPORT
// ================================
const ItemModel = mongoose.model('Item', itemSchema);
const CategoryModel = mongoose.model('Category', categorySchema);
const SubcategoryModel = mongoose.model('Subcategory', subcategorySchema);
const HsnSacModel = mongoose.model('HsnSac', hsnSacSchema);
const BatchSerialModel = mongoose.model('BatchSerial', batchSerialSchema);

export default ItemModel;
export { CategoryModel, SubcategoryModel, HsnSacModel, BatchSerialModel };
