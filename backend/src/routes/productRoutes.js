import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct, updateProductStatus } from '../controllers/productController.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '-')}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: (req, file, callback) => callback(null, /\.(jpg|jpeg|png|webp)$/i.test(path.extname(file.originalname))) });
const router = Router();
router.route('/').get(listProducts).post(upload.single('image'), createProduct);
router.route('/:id').get(getProduct).put(upload.single('image'), updateProduct).delete(deleteProduct);
router.patch('/:id/status', updateProductStatus);
export default router;
