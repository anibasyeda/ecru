import rateLimit from 'express-rate-limit'

// General cap for the whole API. Protects a public deployment from being
// hammered (which on a free tier means DB load + bandwidth = your problem).
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per IP per window
  standardHeaders: true, // send RateLimit-* headers so clients can see limits
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})

// Strict cap on auth routes. Login/register are the brute-force targets, so
// they get a much tighter budget than the rest of the API.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login/register attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later.' },
})
