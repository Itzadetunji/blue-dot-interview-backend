import type { Request, Response } from "express";
import CategoryModel from "../models/category";

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name, description } = req.body;

		// Create a new category
		const category = new CategoryModel({
			name,
			description,
		});

		await category.save();
		res.status(201).json(category);
	} catch (error: any) {
		if (error.code === 11000) {
			res.status(400).json({ error: "Category name must be unique" });
		} else {
			res.status(500).json({ error: "Error creating category" });
		}
	}
};

// Get all categories
export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const categories = await CategoryModel.find({});
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({ error: "Error fetching categories" });
	}
};

// Get a single category by ID
export const getCategoryById = async (req: any, res: any) => {
	try {
		const category = await CategoryModel.findById(req.params.id);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.status(200).json(category);
	} catch (error) {
		res.status(500).json({ error: "Error fetching category" });
	}
};

// Update a category
export const updateCategory = async (req: any, res: any) => {
	try {
		const { name, description } = req.body;

		// Find the category by ID and update it
		const category = await CategoryModel.findByIdAndUpdate(
			req.params.id,
			{ name, description },
			{ new: true, runValidators: true }
		);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.status(200).json(category);
	} catch (error: any) {
		if (error.code === 11000) {
			res.status(400).json({ error: "Category name must be unique" });
		} else {
			res.status(500).json({ error: "Error updating category" });
		}
	}
};

// Delete a category
export const deleteCategory = async (req: any, res: any) => {
	try {
		const category = await CategoryModel.findByIdAndDelete(req.params.id);

		if (!category) {
			return res.status(404).json({ error: "Category not found" });
		}

		res.status(200).json({ message: "Category deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting category" });
	}
};
