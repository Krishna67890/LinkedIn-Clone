import express from "express";
import { signup, login, logout } from "../controllers/authControllers.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login  
router.post("/login", login);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;