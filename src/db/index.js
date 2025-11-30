import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        // console.log(connectionInstance);
        console.log(`Database connected successfully at ${connectionInstance.connection.host}` )
    } catch (error) {
        console.error("Error connecting to the database", error);
        throw error;
    }
}

export default connectDB;