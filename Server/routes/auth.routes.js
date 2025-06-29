import {Router} from 'express'
import { signupController, signinController } from "../controllers/auth.controller.js";
const router=Router();
router.route("/signup").post(signupController);
router.route("/signin").post(signinController);
export default router;