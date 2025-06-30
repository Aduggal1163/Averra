import {Router} from 'express';
import { updateUser,getAllUsers,getUserById,getAllUsersWithRole, deleteUser } from '../controllers/user.controller.js';
import {requireSignIn} from '../middlewares/auth.js'
const router= Router();
router.get("/allusers/:role",getAllUsersWithRole);
router.get("/allusers",getAllUsers);
router.get("getuser/:id",getUserById);
router.post("/updateuser/:id",requireSignIn,updateUser);
router.delete("/deleteuser/:id",requireSignIn,deleteUser);
export default router;