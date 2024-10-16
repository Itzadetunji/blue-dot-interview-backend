import express from "express";
import {
	getUserCart,
	addItemToCart,
	updateCartItem,
	removeItemFromCart,
	clearCart,
} from "../controllers/cartController";
import auth from "../middlewares/authentication"; // Path to auth middleware

const router = express.Router();

// Get the current user's cart
router.get("/cart", auth, getUserCart);

// Add a product to the user's cart
router.post("/cart", auth, addItemToCart);

// Update the quantity of a product in the cart
router.put("/cart", auth, updateCartItem);

// Remove a product from the user's cart
router.delete("/cart/:productId", auth, removeItemFromCart);

// Clear the cart
router.delete("/cart", auth, clearCart);

export default router;
