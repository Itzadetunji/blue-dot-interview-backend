import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController';
import auth from '../middlewares/authentication';

const router = express.Router();

// Route to create a product
router.post('/products', auth, createProduct);

// Route to get all mt products with filtering
router.get("/my-products", auth, getMyProducts)

// Route to get all products with filtering
router.get('/products', getAllProducts);

// Route to get a single product by ID
router.get('/products/:id', getProductById);

// Route to update a product (only the owner can update)
router.put('/products/:id', auth, updateProduct);

// Route to delete a product (only the owner can delete)
router.delete('/products/:id', auth, deleteProduct);

export default router;
