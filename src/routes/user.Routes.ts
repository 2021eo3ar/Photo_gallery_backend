import { Router } from "express";
import { createNewUser, loginUser, logoutUser } from "../controllers/user.controller";


const router  = Router()


router.post("/register", createNewUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)

export default router;