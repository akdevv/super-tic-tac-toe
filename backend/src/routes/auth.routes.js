import express from "express";
import {
	login,
	register,
	googleLoginOrRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/google", googleLoginOrRegister);

export default router;
