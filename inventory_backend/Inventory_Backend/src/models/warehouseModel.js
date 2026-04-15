import mongoose from "mongoose";

// ================================
// BIN/RACK SCHEMA
// ================================

const binRackSchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true
    },
    binId: {
      type: String,
      required: true
    },
    rackNumber: {
      type: String,
      required: true
    },
    binType: {
      type: String,
      enum: [
        'Pallet Bin',
        'Shelf Bin',
        'Bulk Bin',
        'Carton Bin',
        'Small Parts Bin',
        'Cold Storage Bin',
        'Hazardous Bin',
        'Floor Bin'
      ],
      required: true
    },
    location: {
      type: String,
      required: true
    },
    productCategory: {
      type: String,
      enum: [
        'Electronics',
        'Furniture',
        'Clothing',
        'Food & Beverages',
        'Pharmaceuticals',
        'Automotive',
        'Books & Media',
        'Home & Garden'
      ],
      required: true
    },
    level: {
      type: String,
      required: true
    },
    zone: {
      type: String,
      enum: [
        'Zone A',
        'Zone B',
        'Zone C',
        'Zone D',
        'Zone E',
        'Cold Storage',
        'Hazardous',
        'Bulk Storage',
        'Pick & Pack'
      ],
      required: true
    },
    capacity: {
      type: Number,
      required: true
    },
    currentStock: {
      type: Number,
      default: 0
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
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['Celsius', 'Fahrenheit'],
        default: 'Celsius'
      }
    },
    humidity: {
      min: Number,
      max: Number
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isReserved: {
      type: Boolean,
      default: false
    },
    reservedFor: {
      type: String
    },
    reservedUntil: {
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
// WAREHOUSE CAPACITY SCHEMA
// ================================
const warehouseCapacitySchema = new mongoose.Schema(
  {
    warehouseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true
    },
    totalZonesInWarehouse: {
      type: Number,
      required: true
    },
    totalCapacity: {
      type: Number,
      required: true
    },
    usedCapacity: {
      type: Number,
      default: 0
    },
    availableCapacityVolume: {
      type: Number,
      required: true
    },
    availableCapacityWeight: {
      type: Number,
      required: true
    },
    totalCapacityVolume: {
      type: Number, // in cubic meters
      required: true
    },
    availableCapacityVolume: {
      type: Number, // in cubic meters
      default: 0
    },
    reservedCapacity: {
      type: Number,
      default: 0
    },
    capacityUnit: {
      type: String,
      enum: ['cubic_meters', 'cubic_feet', 'pallets', 'units'],
      default: 'cubic_meters'
    },
    weightCapacity: {
      total: Number,
      used: { type: Number, default: 0 },
      available: Number,
      unit: {
        type: String,
        enum: ['kg', 'tons', 'pounds'],
        default: 'kg'
      }
    },
    utilizationPercent: {
      type: Number,
      default: 0
    },
    throughputCapacity: {
      type: Number, // orders/day
      default: 0
    },
    zoneCapacities: [{
      zoneName: String,
      totalCapacity: Number,
      usedCapacity: { type: Number, default: 0 },
      availableCapacity: Number,
      bins: Number // Added to match React dynamic zone fields
    }],
    rackCapacities: [{
      rackNumber: String,
      totalCapacity: Number,
      usedCapacity: { type: Number, default: 0 },
      availableCapacity: Number
    }],
    binCapacities: [{
      binId: String,
      totalCapacity: Number,
      usedCapacity: { type: Number, default: 0 },
      availableCapacity: Number
    }],
    status: {
      type: String,
      enum: ['Good', 'Warning', 'Critical'],
      default: 'Good'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    alertThreshold: {
      type: Number,
      default: 80 // Percentage
    },
    isAlertTriggered: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true
    }
  },
  { timestamps: true }
)

// ================================
// WAREHOUSE SETUP SCHEMA
// ================================
const warehouseSetupSchema = new mongoose.Schema(
    {
        warehouseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Warehouse',
            required: true
        },
        setupType: {
            type: String,
            enum: ['New', 'Expansion', 'Relocation', 'Renovation'],
            required: true
        },
        setupDate: {
            type: Date,
            required: true
        },
        completionDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
            default: 'Planning'
        },
        zones: [{
            zoneName: String,
            zoneType: {
                type: String,
                enum: ['Storage', 'Receiving', 'Shipping', 'Picking', 'Packaging', 'Quality Control']
            },
            area: Number,
            capacity: Number,
            temperature: {
                min: Number,
                max: Number,
                unit: {
                    type: String,
                    enum: ['Celsius', 'Fahrenheit'],
                    default: 'Celsius'
                }
            },
            humidity: {
                min: Number,
                max: Number
            },
            specialRequirements: [String],
            isActive: { type: Boolean, default: true }
        }],
        equipment: [{
            equipmentType: {
                type: String,
                enum: ['Forklift', 'Pallet Jack', 'Conveyor', 'Racking System', 'Security System', 'Climate Control', 'Lighting']
            },
            equipmentName: String,
            quantity: Number,
            specifications: mongoose.Schema.Types.Mixed,
            installationDate: Date,
            warrantyExpiry: Date,
            maintenanceSchedule: String,
            isActive: { type: Boolean, default: true }
        }],
        safetyFeatures: [{
            featureName: String,
            featureType: {
                type: String,
                enum: ['Fire Safety', 'Security', 'Emergency', 'Environmental', 'Access Control']
            },
            description: String,
            installationDate: Date,
            lastInspection: Date,
            nextInspection: Date,
            isActive: { type: Boolean, default: true }
        }],
        compliance: [{
            complianceType: {
                type: String,
                enum: ['Safety', 'Environmental', 'Quality', 'Security', 'Regulatory']
            },
            complianceName: String,
            certificateNumber: String,
            issuedBy: String,
            issueDate: Date,
            expiryDate: Date,
            isActive: { type: Boolean, default: true }
        }],
        costs: {
            totalCost: Number,
            equipmentCost: Number,
            laborCost: Number,
            materialCost: Number,
            otherCosts: Number,
            currency: {
                type: String,
                default: 'INR'
            }
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
// WAREHOUSE SCHEMA (UPDATED)
// ================================
const warehouseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        code: {
            type: String,
            required: true,
            unique: true
        },
        address: {
            type: String,
            required: true
        },
        location:{
            type:String
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
        capacity: {
            type: Number,
            default: 0
        },
        currentStock: {
            type: Number,
            default: 0
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff'
        },
        contactNumber: {
            type: String
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Maintenance', 'Under Maintenance'],
            default: 'Active'
        },
        contactPerson: {
            type: String
        },
        contactPersonPhone: {
            type: String
        },
        contactPersonEmail: {
            type: String
        },
        // Branch frontend fields
        alternatePhone: {
            type: String
        },
        email: {
            type: String
        },
        country: {
            type: String,
            default: 'India'
        },
        gstNumber: {
            type: String
        },
        panNumber: {
            type: String
        },
        managerName: {
            type: String
        },
        managerEmail: {
            type: String
        },
        employeeCount: {
            type: Number
        },
        area: {
            type: Number
        },
        rentAmount: {
            type: Number
        },
        bins: [{
            binId: String,
            rackNumber: String,
            level: String,
            capacity: Number,
            currentStock: { type: Number, default: 0 }
        }],
        // Additional fields for comprehensive warehouse management
        warehouseType: {
            type: String,
            enum: ['Main', 'Branch', 'Distribution Center', 'Cold Storage', 'Bonded', 'Head Office', 'Regional Office', 'Warehouse'],
            default: 'Branch'
        },
        operatingHours: {
            start: String,
            end: String,
            timezone: {
                type: String,
                default: 'Asia/Kolkata'
            }
        },
        tempreatureControl:{
            type:String,
            enum:['Controlled','Climate Controlled','Amibent','Cold Storage']
        },
        securityLevel:{
            type:String,
            enum:['High','Very High','Medium','Low']
        },
        automationLevel:{
            type:String,
            enum:['Fully Automated','Semi Automated','Manual']
        },
        establishDate: {
            type: Date
        },
        specialFeatures: [{
            feature: String,
            description: String
        }],
        coordinates: {
            latitude: Number,
            longitude: Number
        },
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
const WarehouseModel = mongoose.model('Warehouse', warehouseSchema);
const BinRackModel = mongoose.model('BinRack', binRackSchema);
const WarehouseCapacityModel = mongoose.model('WarehouseCapacity', warehouseCapacitySchema);
const WarehouseSetupModel = mongoose.model('WarehouseSetup', warehouseSetupSchema);

export default WarehouseModel;
export { BinRackModel, WarehouseCapacityModel, WarehouseSetupModel };

