import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import User from './models/User.js'

// Promote an existing user to admin by email.
// Usage:  npm run make-admin your@email.com
// (Admins are made here, on purpose — never through the public register route.)
const email = process.argv[2]

async function run() {
  if (!email) {
    console.error('Usage: npm run make-admin <email>')
    process.exit(1)
  }

  await connectDB(process.env.MONGO_URI)

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() }, // schema lowercases emails, so match that
    { role: 'admin' },
    { new: true },
  )

  if (!user) {
    console.error(`No user found with email: ${email}`)
  } else {
    console.log(`✓ ${user.email} is now an admin.`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
