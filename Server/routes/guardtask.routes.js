import express from "express";
import {
  createTask,
  getMyTasks,
  updateTaskStatus,
  markTaskAchieved,
  getAllUnachievedTasks,
  deleteTask
} from "../controllers/guardtask.controller.js";
import { requireSignIn } from "../middlewares/auth.js";

const router = express.Router();

router.post("/create", requireSignIn, createTask); // Admin only
router.get("/mytasks", requireSignIn, getMyTasks); // Guard only
router.post("/update/:taskId", requireSignIn, updateTaskStatus); // Guard
router.post("/achieve/:taskId", requireSignIn, markTaskAchieved); // Admin
router.get("/unachieved", requireSignIn, getAllUnachievedTasks);
router.delete("/deleteTask/:taskId",requireSignIn,deleteTask);

export default router;
