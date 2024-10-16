import type { Request, Response } from "express";
import ProductModel from "../models/product";
import mongoose from "mongoose";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, description, price, category, image } = req.body;

		const product = new ProductModel({
			name,
			description,
			price,
			category: new mongoose.Types.ObjectId(category), // Convert category to ObjectId
			image,
			owner: req.user?.userId, // Attach the logged-in user as the owner
		});

		await product.save();
		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({ error: "Error creating product" });
	}
};

// Get all products with filters
export const getAllProducts = async (req: any, res: any) => {
	try {
		const { name, category, minPrice, maxPrice } = req.query;

		const filter: any = {};

		if (name) {
			filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
		}

		if (category) {
			filter.category = category;
		}

		if (minPrice || maxPrice) {
			filter.price = {};
			if (minPrice) filter.price.$gte = Number(minPrice);
			if (maxPrice) filter.price.$lte = Number(maxPrice);
		}

		const products = await ProductModel.find(filter).populate(
			"category",
			"name"
		);
		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({ error: "Error fetching products" });
	}
};

// Get a single product by ID
export const getProductById = async (req: any, res: any) => {
	try {
		const product = await ProductModel.findById(req.params.id).populate(
			"category",
			"name"
		);

		if (!product) {
			return res.status(404).json({ error: "Product not found" });
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: "Error fetching product" });
	}
};

// Update a product
export const updateProduct = async (req: any, res: any) => {
	try {
		const { name, description, price, category, image } = req.body;

		// Find the product and check if the logged-in user is the owner
		const product = await ProductModel.findOne({
			_id: req.params.id,
			owner: req.user?.userId,
		});

		if (!product) {
			return res
				.status(404)
				.json({ error: "Product not found or unauthorized" });
		}

		if (name) product.name = name;
		if (description) product.description = description;
		if (price) product.price = price;
		if (category) product.category = new mongoose.Types.ObjectId(category); // Convert to ObjectId
		if (image) product.image = image;

		product.updatedAt = new Date();

		await product.save();
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: "Error updating product" });
	}
};

// Delete a product
export const deleteProduct = async (req: any, res: any) => {
	try {
		// Find the product and ensure the logged-in user is the owner
		const product = await ProductModel.findOneAndDelete({
			_id: req.params.id,
			owner: req.user?.userId,
		});

		if (!product) {
			return res
				.status(404)
				.json({ error: "Product not found or unauthorized" });
		}

		res.status(200).json({ message: "Product deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting product" });
	}
};
