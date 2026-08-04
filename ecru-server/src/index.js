import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

// Local dev / long-running host entry point. On Vercel this file is NOT used —
// the platform invokes api/index.js per request instead of a listening server.
const PORT = process.env.PORT || 5000

// Connect to the DB first, then start listening. If the DB is unreachable we
// exit instead of serving an API that can't do anything.
connectDB(process.env.MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)),
  )
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message)
    process.exit(1)
  })
