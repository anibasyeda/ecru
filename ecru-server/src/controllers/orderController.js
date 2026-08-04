import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// POST /api/orders
// Body: { items: [{ id, qty }] }
//
// Key decision: the client sends only product IDs and quantities — never
// prices. We look prices up from the DB and compute the total on the server,
// so a tampered request can't change what things cost.
export const createOrder = asyncHandler(async (req, res) => {
  const { items } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400)
    throw new Error('Order must contain at least one item')
  }

  const ids = items.map((i) => i.id)
  const products = await Product.find({ _id: { $in: ids } })

  const lineItems = items.map((i) => {
    const product = products.find((p) => p._id.equals(i.id))
    if (!product) {
      res.status(400)
      throw new Error(`Product not found: ${i.id}`)
    }
    const qty = Math.max(1, Number(i.qty) || 1)
    return { product: product._id, name: product.name, price: product.price, qty }
  })

  const total = lineItems.reduce((sum, l) => sum + l.price * l.qty, 0)

  const order = await Order.create({
    user: req.user?._id, // set by optionalAuth when logged in, else undefined
    items: lineItems,
    total,
  })

  res.status(201).json(order)
})

// GET /api/orders/mine  — a logged-in user's order history
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json(orders)
})
