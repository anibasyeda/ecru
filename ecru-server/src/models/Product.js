import mongoose from 'mongoose'

// Mirrors the shape the React store already uses, with validation added.
// `category` holds the "Step 01 — Cleanse" label the UI shows.
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    size: { type: String, default: '' },
    active: { type: String, default: '' },
    skin: { type: String, default: '' },
    description: { type: String, required: true },
    image: { type: String, required: true },
    tag: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true },
)

export default mongoose.model('Product', productSchema)
