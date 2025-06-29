import { viewAllVisitorGatepass,requestVisitorGatePass,acceptRejectVisitorGatepass, getMyGatepass, viewAllPendingGatepass, getTodaysVisitorLog } from "../controllers/Visitorgatepass.controller.js";
import {Router} from 'express';
import {requireSignIn} from '../middlewares/auth.js';
const router = Router()
router.post("/requestGatepass",requireSignIn,requestVisitorGatePass);
router.get("/viewAllVisitorGatepass",requireSignIn,viewAllVisitorGatepass);
router.get("/mygatepass/:gatepassId",requireSignIn,getMyGatepass);
router.post("/updateGatepassStatus/:gatepassId",requireSignIn,acceptRejectVisitorGatepass)
router.get("/allpendinggatepasses",requireSignIn,viewAllPendingGatepass);
router.get("/visitorlog", requireSignIn, getTodaysVisitorLog);
export default router;