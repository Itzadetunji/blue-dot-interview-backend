import express from "express";
import authRoutes from "./authRoutes";

const router = express.Router();

// Auth Routes
router.use("/auth", authRoutes);

export default router;
