import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { createBroadcast, deleteBroadcast, getAllBroadcasts, updateBroadcast } from "../controllers/broadcast.controller.js";
import { requireSignIn } from "../middlewares/auth.js";
const router=express.Router();
router.post("/createBroadcast",requireSignIn,upload.single('image'),createBroadcast);
router.get("/getAllBroadcast",requireSignIn,getAllBroadcasts);
router.post("/updateBroadcast/:id",requireSignIn,updateBroadcast)
router.delete("/deleteBroadcast/:id",requireSignIn,deleteBroadcast);
export default router;