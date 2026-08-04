import { Router } from 'express'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/auth.js'

const router = Router()

// Public: anyone can read the catalogue.
router.get('/', getProducts)
router.get('/:id', getProductById)

// Admin only: create / update / delete. `protect` checks the token,
// `admin` checks the role. Both must pass before the controller runs.
router.post('/', protect, admin, createProduct)
router.put('/:id', protect, admin, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router
