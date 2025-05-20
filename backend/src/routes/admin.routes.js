import { Router } from "express";
import {
    registerAdmin,
    adminLogin,
    logoutAdmin
} from "../controllers/admin.controller.js"
import { verifyJWTAdmin } from "../middlewares/auth.middlewares.js";
const router = Router();

router.post("/register-admin", registerAdmin)
router.post('/login-admin',adminLogin);
router.post('/logout-admin',verifyJWTAdmin,logoutAdmin)

export default router;