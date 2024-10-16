import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';
import auth from '../middlewares/authentication'; // Path to your auth middleware

const router = express.Router();

// Route to create a new order from the cart (logged-in users only)
router.post('/orders', auth, createOrder);

// Route to get all orders of the logged-in user
router.get('/orders', auth, getUserOrders);

// Route to get a single order by ID (logged-in users only)
router.get('/orders/:id', auth, getOrderById);

// Route to update the order status (for admin or after payment confirmation)
router.put('/orders/:id/status', auth, updateOrderStatus);

// Route to delete an order (logged-in users only)
router.delete('/orders/:id', auth, deleteOrder);

export default router;
