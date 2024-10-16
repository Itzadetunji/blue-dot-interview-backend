import express from "express";
import authRoutes from "./authRoutes";
import productRoutes from "./productRoutes";
import categoryRoutes from "./categoryRoutes";
import orderRoutes from "./orderRoutes";
import cartRoutes from "./cartRoutes";

const router = express.Router();

// Auth Routes
router.use("/auth", authRoutes);
router.use(categoryRoutes);
router.use(productRoutes);
router.use(orderRoutes);
router.use(cartRoutes);

export default router;
