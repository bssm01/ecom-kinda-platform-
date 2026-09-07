import {findAllProducts, findProductById, createProduct, updateProduct, deleteProduct} from '../controllers/productCRUD.js';
import express from 'express';
import productMiddleware from '../middleware/productMiddleware.js';

const router = express.Router();

router.get('/', productMiddleware, findAllProducts);
router.get('/:id', productMiddleware, findProductById);
router.post('/createProduct', productMiddleware, createProduct);
router.put('/updateProduct/:id', productMiddleware, updateProduct);
router.delete('/deleteProduct/:id', productMiddleware, deleteProduct);

export default router;