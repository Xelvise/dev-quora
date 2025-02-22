import mongoose from "mongoose";
import { setTimeout } from "timers";

let isConnected = false;

export default async function connectToDB(retries: number = 0) {
    retries += 1;
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) {
        return console.log("Cannot find MongoDB URL");
    }
    if (isConnected) {
        return console.log("MongoDB is already connected");
    }
    // If MongoDB URL exists and not connected yet, then initiate a connection
    do {
        try {
            await mongoose.connect(process.env.MONGODB_URL, { dbName: "DevQuora" });
            isConnected = true;
            return console.log("MongoDB is connected");
        } catch (error) {
            console.log("MongoDB connection error: ", error);
            retries -= 1;
            // set a timer of 5 seconds before retrying to reconnect
            if (retries >= 1) await new Promise(resolve => setTimeout(resolve, 5000));
            else console.error("Unable to retry connection", error);
        }
    } while (retries >= 1);
}
