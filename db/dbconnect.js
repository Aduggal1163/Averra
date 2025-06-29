import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config();
export const dbconnect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error+"Error in connecting to the database");
    }
}