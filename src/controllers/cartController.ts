import type { Request, Response } from "express";
import CartModel from "../models/cart";
import ProductModel from "../models/product";

// Get the cart for the current user
export const getUserCart = async (req: any, res: any) => {
	try {
		const cart = await CartModel.findOne({ user: req.user?.userId }).populate({
			path: "items.product",
			select: "name price description category image totalInStock",
			populate: {
				path: "category",
				select: "name _id",
			},
		});

		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error fetching cart" });
	}
};

// Add an item to the cart or update quantity if it already exists
export const addItemToCart = async (req: any, res: any) => {
	const { productId, quantity } = req.body;

	const requestedQuantity = parseInt(quantity);

	try {
		// Check if the product exists
		const product = await ProductModel.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Find the user's cart
		let cart = await CartModel.findOne({ user: req.user?.userId });

		// Get the current quantity of the product in the cart
		let currentCartQuantity = 0;

		if (cart) {
			const existingItem = cart.items.find(
				(item: any) => item.product.toString() === productId
			);
			if (existingItem) {
				currentCartQuantity = existingItem.quantity;
			}
		}

		// Calculate the total quantity if the item is added to the cart
		const totalQuantityInCart = currentCartQuantity + requestedQuantity;

		// Check if the total quantity in the cart exceeds the stock available
		if (totalQuantityInCart > product.totalInStock) {
			return res.status(400).json({
				message: `Cannot add more than ${product.totalInStock} units to the cart.`,
			});
		}

		if (!cart) {
			// Create a new cart if none exists
			cart = new CartModel({
				user: req.user?.userId,
				items: [{ product: productId, quantity: requestedQuantity }],
			});
		} else {
			// Check if the product already exists in the cart
			const existingItemIndex = cart.items.findIndex(
				(item: any) => item.product.toString() === productId
			);
			if (existingItemIndex > -1) {
				// If the product exists, update the quantity
				cart.items[existingItemIndex].quantity += requestedQuantity;
			} else {
				// If the product does not exist, add a new item to the cart
				cart.items.push({ product: productId, quantity: requestedQuantity });
			}
		}

		cart.updatedAt = new Date();
		await cart.save();

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error adding item to cart" });
	}
};

// Update the quantity of a product in the cart
export const updateCartItem = async (req: any, res: any) => {
	const { productId, quantity } = req.body;

	try {
		// Find the user's cart
		const cart = await CartModel.findOne({ user: req.user?.userId });
		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		// Find the item in the cart
		const itemIndex = cart.items.findIndex(
			(item: any) => item.product.toString() === productId
		);

		if (itemIndex === -1) {
			return res.status(404).json({ message: "Product not found in cart" });
		}

		// Check if the product exists and fetch its totalInStock
		const product = await ProductModel.findById(productId);
		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Check if the quantity being updated does not exceed the total stock available
		if (quantity > product.totalInStock) {
			return res.status(400).json({
				message: `Cannot update to more than ${product.totalInStock} units. Current stock limit exceeded.`,
			});
		}

		if (quantity > 0) {
			// Update the quantity if greater than 0
			cart.items[itemIndex].quantity = quantity;
		} else {
			// Remove the item if the quantity is 0 or less
			cart.items.splice(itemIndex, 1);
		}

		cart.updatedAt = new Date();
		await cart.save();

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error updating cart item" });
	}
};

// Update the full cart
export const updateCart = async (req: any, res: any) => {
  const { items } = req.body; // Expecting an array of { productId, quantity } pairs

  try {
    // Find the user's cart
    const cart = await CartModel.findOne({ user: req.user?.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Iterate through the items array and update the cart accordingly
    for (const { productId, quantity } of items) {
      // Find the item in the cart
      const itemIndex = cart.items.findIndex(
        (item: any) => item.product.toString() === productId
      );

      // Check if the product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: `Product with ID ${productId} not found` });
      }

      // Check if the quantity being updated does not exceed the total stock available
      if (quantity > product.totalInStock) {
        return res.status(400).json({
          message: `Cannot update ${product.name} to more than ${product.totalInStock} units. Stock limit exceeded.`,
        });
      }

      if (itemIndex > -1) {
        // If the item is already in the cart, update the quantity
        if (quantity > 0) {
          cart.items[itemIndex].quantity = quantity;
        } else {
          // Remove the item if the quantity is 0 or less
          cart.items.splice(itemIndex, 1);
        }
      } else if (quantity > 0) {
        // If the item is not in the cart and the quantity is > 0, add the item to the cart
        cart.items.push({ product: productId, quantity });
      }
    }

    cart.updatedAt = new Date();
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
};


// Remove an item from the cart
export const removeItemFromCart = async (req: any, res: any) => {
	const { productId } = req.params;

	try {
		// Find the user's cart
		const cart = await CartModel.findOne({ user: req.user?.userId });
		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		// Use Mongoose's pull method to remove the product from the items array
		cart.items.pull({ product: productId });

		cart.updatedAt = new Date();
		await cart.save();

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error removing item from cart" });
	}
};

// Clear the entire cart
export const clearCart = async (req: any, res: any) => {
	try {
		const cart = await CartModel.findOneAndUpdate(
			{ user: req.user?.userId },
			{ items: [], updatedAt: new Date() },
			{ new: true }
		);

		if (!cart) {
			return res.status(404).json({ message: "Cart not found" });
		}

		res.status(200).json(cart);
	} catch (error) {
		res.status(500).json({ error: "Error clearing cart" });
	}
};
