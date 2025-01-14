import type { Request, Response } from "express";
import ProductModel from "../models/product";
import mongoose from "mongoose";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
	try {
		const { name, description, price, category, image, totalInStock } =
			req.body;

		const product = new ProductModel({
			name,
			description,
			price,
			category: new mongoose.Types.ObjectId(category), // Convert category to ObjectId
			image,
			totalInStock,
			owner: req.user?.userId, // Attach the logged-in user as the owner
		});

		console.log("dqed");

		await product.save();
		res.status(201).json(product);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error creating product" });
	}
};

// Get all products owned by the logged-in user
export const getMyProducts = async (req: any, res: any) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    // Initialize filter object for products
    const filter: any = {
      owner: req.user?.userId, // Only fetch products owned by the logged-in user
    };

    // Add filters based on query parameters
    if (name) {
      filter.name = { $regex: name, $options: "i" }; // Case-insensitive search for product name
    }

    if (category) {
      filter.category = category; // Filter by category
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice); // Filter by minimum price
      if (maxPrice) filter.price.$lte = Number(maxPrice); // Filter by maximum price
    }

    // Fetch products owned by the user with the applied filters
    const products = await ProductModel.find(filter).populate("category", "name");

    // Check if products were found
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }

    // Return the products in the response
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user's products" });
  }
};


// Get all products with filters
export const getAllProducts = async (req: Request, res: any) => {
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
export const getProductById = async (req: Request, res: any) => {
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
export const updateProduct = async (req: Request, res: any) => {
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
export const deleteProduct = async (req: Request, res: any) => {
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
