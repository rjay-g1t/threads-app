import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);
    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URI is not defined");
    }
    if (isConnected) {
        return console.log("Already connected to database");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to database");
    } catch (error) {
        console.log("Error connecting to database: ", error);
        throw error;
    }
}
