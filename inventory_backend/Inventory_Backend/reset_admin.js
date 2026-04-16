import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
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

        // Generate secure random password
        const initialPassword = crypto.randomBytes(16).toString('hex').substring(0, 12);
        const hashedPassword = await bcrypt.hash(initialPassword, 10);
        
        const result = await AdminModel.updateOne(
            { email: 'superadmin@gmail.com' },
            { $set: { password: hashedPassword } },
            { upsert: true } // Create if doesn't exist
        );

        if (result.upsertedCount > 0) {
            console.log('✅ Admin user created successfully');
        } else {
            console.log('✅ Admin password reset successfully');
        }
        
        console.log('\n🔐 IMPORTANT: Initial Admin Password (store this safely):');
        console.log(`Password: ${initialPassword}`);
        console.log('\n⚠️  CHANGE THIS PASSWORD IMMEDIATELY after first login!');
        console.log('Email: superadmin@gmail.com');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();
