import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import Product from './models/Product.js'

// The same catalogue the frontend shipped with, moved into the DB.
// Run once with `npm run seed`.
const products = [
  {
    name: 'Quiet Cleanser',
    category: 'Step 01 · Cleanse',
    price: 32,
    size: '150 ml',
    active: 'Amino acids',
    skin: 'All skin types',
    description:
      'A pH-balanced gel-to-milk cleanser that lifts the day without stripping. Leaves skin soft, calm and never tight.',
    image:
      'https://images.unsplash.com/photo-1617897903246-719242758050?w=900&q=90&fit=crop',
    tag: 'Bestseller',
  },
  {
    name: 'Even Serum',
    category: 'Step 02 · Treat',
    price: 48,
    size: '30 ml',
    active: '10% Niacinamide',
    skin: 'Dull, uneven',
    description:
      'A weightless serum that visibly smooths tone and refines texture over four weeks. The one bottle that does the most.',
    image:
      'https://images.unsplash.com/photo-1631730359585-38a4935cbec4?w=900&q=90&fit=crop&crop=right',
    tag: 'New',
  },
  {
    name: 'Slow Oil',
    category: 'Step 03 · Treat',
    price: 54,
    size: '30 ml',
    active: 'Squalane + rosehip',
    skin: 'Dry, mature',
    description:
      'Nine cold-pressed oils in a single-drop ritual. Deeply nourishing, quick to absorb, quietly luminous.',
    image:
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=900&q=90&fit=crop',
    tag: '',
  },
  {
    name: 'Bare Cream',
    category: 'Step 04 · Protect',
    price: 42,
    size: '50 ml',
    active: 'Ceramides',
    skin: 'Normal to dry',
    description:
      'A cushioning daily moisturiser that rebuilds the barrier while it hydrates. Matte finish, zero fragrance.',
    image:
      'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?w=900&q=90&fit=crop',
    tag: '',
  },
  {
    name: 'Daylight SPF 30',
    category: 'Step 05 · Protect',
    price: 38,
    size: '50 ml',
    active: 'Mineral zinc',
    skin: 'All skin types',
    description:
      'An invisible mineral shield that sits beautifully under everything, with no white cast or greasy film.',
    image:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=90&fit=crop',
    tag: 'Bestseller',
  },
  {
    name: 'The Essentials Set',
    category: 'Curated · Save 15%',
    price: 180,
    size: 'Full ritual',
    active: 'All five',
    skin: 'All skin types',
    description:
      'The complete four-minute routine in one box. Everything above, thoughtfully priced and beautifully boxed.',
    image:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&q=90&fit=crop',
    tag: 'Value',
  },
]

async function run() {
  await connectDB(process.env.MONGO_URI)
  await Product.deleteMany()
  const created = await Product.insertMany(products)
  console.log(`Seeded ${created.length} products`)
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
