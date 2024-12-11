import express from "express";
import { register, login, logout } from "../../controllers/authController";
import auth from "../../middlewares/authentication";

const router = express.Router();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Logout Route
router.post("/logout", auth, logout);
export default router;
