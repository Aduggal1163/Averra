import express from "express";
import { getfeedback } from "../controllers/Contact.controller.js";
const router=express.Router();
router.post("/feedback",getfeedback);
export default router;