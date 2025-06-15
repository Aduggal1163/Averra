import express from "express";
import dotenv from "dotenv";
import { dbconnect } from "./db/dbconnect.js";
import AuthRouter from './routes/auth.routes.js'
import BookingRoutes from './routes/booking.routes.js'
import ComplaintRoutes from './routes/complaint.routes.js'
import GatepassRoutes from './routes/visitorgatepass.routes.js'
import UserRoutes from './routes/user.routes.js'
dotenv.config();
const app=express();
app.use(express.json());

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/service-booking",BookingRoutes);
app.use("/api/v1/complaints",ComplaintRoutes);
app.use("/api/v1/gatepass",GatepassRoutes);
app.use("/api/v1/users",UserRoutes);
//work till 16-06-2025

dbconnect();
app.listen(process.env.PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`);
})