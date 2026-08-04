import 'dotenv/config'
import app from '../src/app.js'
import { connectDB } from '../src/config/db.js'

// Vercel serverless entry point.
//
// Vercel doesn't run a listening server — it invokes this handler once per
// request. So instead of app.listen(), we make sure the (cached) DB connection
// is live, then hand the request straight to the Express app, which is itself
// just a (req, res) function. All routing/middleware still lives in src/app.js.
export default async function handler(req, res) {
  try {
    await connectDB(process.env.MONGO_URI)
  } catch (err) {
    console.error('DB connection failed:', err.message)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ message: 'Database connection failed' }))
  }
  return app(req, res)
}
