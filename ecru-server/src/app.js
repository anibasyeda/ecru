import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'
import { apiLimiter, authLimiter } from './middleware/rateLimit.js'

// Builds and exports the Express app WITHOUT starting a server or connecting
// to the DB. This lets two entry points reuse the exact same app:
//   - src/index.js   → local dev / a long-running host (calls app.listen)
//   - api/index.js   → Vercel serverless (invokes the app per request)
const app = express()

// Behind a hosting proxy (Vercel, Render, etc.) the client IP arrives in a
// header. Trusting one proxy hop lets the rate limiter see the real visitor IP
// instead of rate-limiting everyone as a single proxy address.
app.set('trust proxy', 1)

// Only allow the known frontend origin(s) to call the API.
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(',') : '*',
    credentials: true,
  }),
)
app.use(express.json())

// Uptime check — kept BEFORE the limiter so deploy health probes never throttle.
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// General limit on everything under /api, plus a stricter limit on auth.
app.use('/api', apiLimiter)

app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/auth', authLimiter, authRoutes)

// Order matters: these two must be registered last.
app.use(notFound)
app.use(errorHandler)

export default app
