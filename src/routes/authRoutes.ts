import express from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

// Register Route
router.post("/register", (req, res) => register(req, res));

// Login Route
router.post("/login", (req, res) => login(req, res));

export default router;
