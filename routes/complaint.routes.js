import { raiseComplaint,getComplaints,getAllComplaints, updateComplaintStatus } from "../controllers/complaint.controller.js";
import { requireSignIn } from '../middlewares/auth.js';
import upload from '../middlewares/upload.middleware.js';
import {Router} from 'express';
const router=Router();
router.post('/raise-complaint',requireSignIn,upload.single('image'),raiseComplaint);
router.get("/getComplaints/:userId",requireSignIn,getComplaints)
router.get("/getAllComplaints",requireSignIn,getAllComplaints) // for admins and guards
router.post("/updateComplaint/:complaintId",requireSignIn,updateComplaintStatus);
export default router;