import mongoose from 'mongoose'

// Each line stores a snapshot of name + price at purchase time. If a product's
// price changes later, past orders must still show what the customer paid.
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    // Optional: guests can check out without an account.
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: {
      type: [orderItemSchema],
      validate: [(v) => v.length > 0, 'Order needs at least one item'],
    },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped'],
      default: 'pending',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Order', orderSchema)
