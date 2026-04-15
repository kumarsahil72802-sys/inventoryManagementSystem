import mongoose from "mongoose";
import dotenv from 'dotenv';
import { createAdmin } from "../seedData/createAdmin.js";

dotenv.config();

const connection_string = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(connection_string, {
      family: 4,
    }).then(async ()=>{  
      await createAdmin();
      console.log('Connection successfull')}
    );
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
    throw error;
  }
};