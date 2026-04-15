import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        DOB:{
         type:Date,
         required:true
        },
        gender:{
            type:String
        },
        qualification:{
            type:String
        },
        experience:{
            type:String
        },

        branchName:{
            type:String
        },
        designation:{
            type:String
        },
        highestQualificationCertificate:{
            type:String
        },
        aadharCard:{
            type:String
        },
        panCard:{
            type:String
        },
        resumeCertificate:{
            type:String
        },
        accountHolderName:{
            type:String
        },
        accountNumber:{
            type: String,
            sparse: true
        },
        bankName:{
            type:String
        },
        IFSC:{
            type:String
        },
        bankBranch:{
            type:String
        },
        bankLocation:{
            type:String
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
        role: {
            type: String,
            required: true,
            enum: ['Manager', 'Supervisor', 'Operator', 'Admin']
        },
        department: {
            type: String,
            required: true,
            enum: ['Warehouse', 'Sales', 'Purchase', 'Finance', 'IT', 'HR', 'Administration', 'Support', 'Maintenance', 'Security', 'Housekeeping']
        },
        warehouse: {
            type: String
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'OnLeave'],
            default: 'Active'
        },
        joiningDate: {
            type: Date,
            required: true
        },
        address: {
            line1:{
                type:String,
                required:true
            },
            line2:{
                type:String
            },
            city:{
            type: String,
            required: true
        },
        district:{
type: String,
            required: true
        },
        pinCode:{
type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        }
    },
        salary: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

const StaffModel = mongoose.model('Staff', staffSchema);
export default StaffModel;

