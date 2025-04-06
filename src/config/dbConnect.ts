import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
}

type connectionType = {
    isConnected?: number;
};

const connection: connectionType = {}

async function dbConnect() {
    if (connection.isConnected) {
        console.log("already connected");
        return;
    }

    try {
        const db = await mongoose.connect(MONGODB_URI || '', {});

        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default dbConnect;