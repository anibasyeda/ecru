import Product from '../models/Product.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/products  — the list the storefront renders
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: 1 })
  res.json(products)
})

// GET /api/products/:id  — single product (detail view / modal)
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json(product)
})

// POST /api/products  (admin) — create a product.
// Product.create runs the schema validators, so missing required fields
// (name, price, description, image) are rejected automatically.
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

// PUT /api/products/:id  (admin) — update a product.
// runValidators:true forces schema validation on the update (off by default);
// new:true returns the updated document rather than the pre-update one.
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json(product)
})

// DELETE /api/products/:id  (admin) — remove a product.
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }
  res.json({ message: 'Product deleted', id: req.params.id })
})
