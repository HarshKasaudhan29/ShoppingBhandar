import express from 'express';
import {
  getProducts, getProductById, getFeaturedProducts,
  getCategories, createProduct, updateProduct,
  deleteProduct, createReview,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',          getProducts);
router.get('/featured',  getFeaturedProducts);
router.get('/categories',getCategories);
router.get('/:id',       getProductById);

router.post('/',         protect, isAdmin, createProduct);
router.put('/:id',       protect, isAdmin, updateProduct);
router.delete('/:id',    protect, isAdmin, deleteProduct);

router.post('/:id/reviews', protect, createReview);

export default router;
