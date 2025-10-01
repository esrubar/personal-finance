import { connect } from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI ?? "";
    try {
        console.log("MONGODB_URI: ", uri);
        await connect(uri);
        console.log("MongoDB Connected");
    } catch (err: any) {
        console.error(err.message);
        process.exit(1);
    }
};

export default connectDB;
