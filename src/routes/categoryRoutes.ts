import express from "express";
import {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
} from "../controllers/categoryController";
import auth from "../middlewares/authentication"; // Path to auth middleware

const router = express.Router();

// Route to create a new category (logged-in users only)
router.post("/categories", auth, createCategory);

// Route to get all categories (public)
router.get("/categories", getAllCategories);

// Route to get a single category by ID (public)
router.get("/categories/:id", getCategoryById);

// Route to update a category (logged-in users only)
router.put("/categories/:id", auth, updateCategory);

// Route to delete a category (logged-in users only)
router.delete("/categories/:id", auth, deleteCategory);

export default router;
