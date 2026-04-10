import mongoose from "mongoose";

const connectToMongoDB = async() => {
    try{
        const mongoUri = process.env.MONGODB_URL || process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("Missing MongoDB connection string. Set MONGODB_URL in .env");
        }

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    }
    catch(error){
       console.log("Error while connecting to MongoDB", error.message);
    }
};

export default connectToMongoDB;