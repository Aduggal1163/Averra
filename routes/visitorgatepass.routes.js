import { viewAllVisitorGatepass,requestVisitorGatePass,acceptRejectVisitorGatepass, getMyGatepass } from "../controllers/Visitorgatepass.controller.js";
import {Router} from 'express';
import {requireSignIn} from '../middlewares/auth.js';
const router = Router()
router.post("/requestGatepass",requireSignIn,requestVisitorGatePass);
router.get("/viewAllVisitorGatepass",requireSignIn,viewAllVisitorGatepass);
router.get("/mygatepass/:gatepassId",requireSignIn,getMyGatepass);
router.post("/updateGatepassStatus/:gatepassId",requireSignIn,acceptRejectVisitorGatepass)
export default router;