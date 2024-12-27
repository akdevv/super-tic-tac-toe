import express from "express";
import {
	login,
	googleLoginOrRegister,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/google", googleLoginOrRegister);

export default router;
