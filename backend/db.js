 import mongoose from "mongoose";

 export const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost/mydatabase");

        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};