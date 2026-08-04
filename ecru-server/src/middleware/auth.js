import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const getToken = (req) => {
  const header = req.headers.authorization
  return header?.startsWith('Bearer ') ? header.split(' ')[1] : null
}

// Hard gate: request is rejected unless a valid token is present.
export const protect = asyncHandler(async (req, res, next) => {
  const token = getToken(req)
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = await User.findById(decoded.id)
  if (!req.user) {
    res.status(401)
    throw new Error('User no longer exists')
  }
  next()
})

// Role gate: only lets admins through. Must run AFTER `protect`, which sets
// req.user. Chain as `protect, admin` on admin-only routes.
export const admin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403) // 403 Forbidden = authenticated but not allowed
    throw new Error('Admin access only')
  }
  next()
}

// Soft gate: attaches req.user if a valid token is present, but lets guests
// through. Used on checkout so both logged-in users and guests can order.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  const token = getToken(req)
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = await User.findById(decoded.id)
    } catch {
      // invalid token on an optional route: ignore, treat as guest
    }
  }
  next()
})
