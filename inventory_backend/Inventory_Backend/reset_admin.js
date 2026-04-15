import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adminSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: { 
          type: String, 
          required: true, 
          unique: true, 
        },
        password: { 
          type: String, 
          required: true 
        },
        userId:{
          type: String,
        }
    },
    { timestamps: true }
);

const AdminModel = mongoose.model('Admin', adminSchema);

async function resetPassword() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4,
        });
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('admin', 10);
        
        const result = await AdminModel.updateOne(
            { email: 'superadmin@gmail.com' },
            { $set: { password: hashedPassword } },
            { upsert: true } // Create if doesn't exist
        );

        if (result.upsertedCount > 0) {
            console.log('Admin user created with password: admin');
        } else {
            console.log('Admin password reset successfully to: admin');
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();
