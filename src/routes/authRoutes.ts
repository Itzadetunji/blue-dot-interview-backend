import express from "express";
import { register, login, logout } from "../controllers/authController";
import auth from "../middlewares/authentication";

const router = express.Router();

// Register Route
router.post("/register", (req, res) => register(req, res));

// Login Route
router.post("/login", (req, res) => login(req, res));

// Logout Route
router.post("/logout", auth, logout);
export default router;
