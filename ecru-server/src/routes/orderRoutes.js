import { Router } from 'express'
import { createOrder, getMyOrders } from '../controllers/orderController.js'
import { protect, optionalAuth } from '../middleware/auth.js'

const router = Router()

// Guests allowed; if logged in, the order is linked to the user.
router.post('/', optionalAuth, createOrder)

// Requires a valid token.
router.get('/mine', protect, getMyOrders)

export default router
