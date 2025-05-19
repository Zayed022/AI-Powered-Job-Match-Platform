import { Router } from "express";
import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser,
} from "../controllers/user.controllers.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.post('/register', registerUser);
router.post('/login',loginUser);
router.get('/profile',verifyJWT,getProfile);
router.post("/logout",verifyJWT,logoutUser)
router.put("/profile", verifyJWT, updateProfile);

export default router