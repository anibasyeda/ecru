import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

// Shape sent back to the client. Never includes the password hash.
// role is included so the frontend can show/hide admin controls.
const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
})

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const exists = await User.findOne({ email })
  if (exists) {
    res.status(409)
    throw new Error('Email already registered')
  }

  const user = await User.create({ name, email, password })
  res.status(201).json({ ...publicUser(user), token: signToken(user._id) })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // password is select:false, so we explicitly ask for it here
  const user = await User.findOne({ email }).select('+password')

  // Same message whether the email or password is wrong — don't reveal which.
  if (!user || !(await user.matchPassword(password))) {
    res.status(401)
    throw new Error('Invalid email or password')
  }

  res.json({ ...publicUser(user), token: signToken(user._id) })
})

// GET /api/auth/me  — who am I (used to restore a session on refresh)
export const me = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user))
})
