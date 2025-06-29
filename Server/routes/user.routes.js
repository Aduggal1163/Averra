import {Router} from 'express';
import { updateUser,getAllUsers,getUserById,getAllUsersWithRole } from '../controllers/user.controller.js';
const router = Router();
router.get("/allusers/:role",getAllUsersWithRole);
router.get("/allusers",getAllUsers);
router.get("getuser/:id",getUserById);
router.post("/updateuser/:id",updateUser);
export default router;