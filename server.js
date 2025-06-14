import express from "express";
import dotenv from "dotenv";
import { dbconnect } from "./db/dbconnect.js";
import AuthRouter from './routes/auth.routes.js'
import BookingRoutes from './routes/booking.routes.js'
dotenv.config();
const app=express();
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/service-booking",BookingRoutes);




dbconnect();
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})