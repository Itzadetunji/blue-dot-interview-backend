import type { Request, Response } from "express";
import OrderModel from "../models/order";
import CartModel from "../models/cart";
import ProductModel from "../models/product";

interface CartItem {
	product: any; // After populate, this will be a full Product document
	quantity: number;
}

export const createOrder = async (req: any, res: any) => {
	try {
		// Find the user's cart and ensure that the product is fully populated
		const cart = await CartModel.findOne({ user: req.user?.userId }).populate<{
			items: CartItem[]; // Explicitly typing the populated items array
		}>({
			path: "items.product",
			select: "price _id totalSales totalInStock", // Also populate totalSales and totalInStock
		});

		// Log the cart to verify its contents
		console.log("Cart:", cart);

		if (!cart || cart.items.length === 0) {
			return res.status(400).json({ message: "Cart is empty" });
		}

		// Calculate the total price
		const total = cart.items.reduce((acc, item) => {
			if (item?.product?.price) {
				return acc + item.product.price * item.quantity;
			}
			return acc;
		}, 0);

		// Log the calculated total
		console.log("Total Price:", total);

		// Create the new order
		const order = new OrderModel({
			user: req.user?.userId,
			items: cart.items.map((item) => ({
				product: item?.product?._id, // Safely access _id
				quantity: item.quantity,
			})),
			total,
		});

		// Log the order before saving
		console.log("Order before save:", order);

		await order.save();

		// Update totalSales and totalInStock for each product in the cart
		for (const item of cart.items) {
			const product = await ProductModel.findById(item.product._id);

			if (product) {
				product.totalSales += item.quantity;
				product.totalInStock -= item.quantity;

				// Ensure stock doesn't drop below zero (for safety)
				if (product.totalInStock < 0) {
					product.totalInStock = 0;
				}

				await product.save();
			}
		}

		// Clear the cart after order creation
		cart.items.splice(0, cart.items.length); // Splice the items array to empty it
		cart.updatedAt = new Date(); // Update the timestamp
		await cart.save();

		res.status(201).json(order);
	} catch (error) {
		console.error("Error:", error);
		res.status(500).json({ error: "Error creating order" });
	}
};

// Get all orders for the logged-in user
export const getUserOrders = async (req: any, res: any) => {
	try {
		const orders = await OrderModel.find({ user: req.user?.userId }).populate(
			"items.product"
		);
		res.status(200).json(orders);
	} catch (error) {
		res.status(500).json({ error: "Error fetching user orders" });
	}
};

// Get a single order by ID
export const getOrderById = async (req: any, res: any) => {
	try {
		const order = await OrderModel.findById(req.params.id).populate(
			"items.product"
		);
		if (!order || order.user.toString() !== req.user?.userId) {
			return res
				.status(404)
				.json({ message: "Order not found or unauthorized" });
		}

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ error: "Error fetching order" });
	}
};

// Update order status (for admin use or after payment confirmation)
export const updateOrderStatus = async (req: any, res: any) => {
	const { status } = req.body;
	try {
		const order = await OrderModel.findById(req.params.id);

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		order.status = status;
		order.updatedAt = new Date();

		await order.save();

		res.status(200).json(order);
	} catch (error) {
		res.status(500).json({ error: "Error updating order status" });
	}
};

// Delete an order (optional)
export const deleteOrder = async (req: any, res: any) => {
	try {
		const order = await OrderModel.findOneAndDelete({
			_id: req.params.id,
			user: req.user?.userId,
		});

		if (!order) {
			return res
				.status(404)
				.json({ message: "Order not found or unauthorized" });
		}

		res.status(200).json({ message: "Order deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: "Error deleting order" });
	}
};
