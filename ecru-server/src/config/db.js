import mongoose from 'mongoose'

// In a serverless environment (Vercel) each request may reuse a "warm"
// container. Without caching, every invocation would open a brand-new Mongo
// connection and quickly exhaust Atlas's connection limit. We cache the
// connection (and the in-flight promise) on `global` so concurrent invocations
// share one connection instead of each opening their own.
//
// On a normal long-running server (local / Render) this simply connects once
// and returns the cached connection on any later call — no behaviour change.
let cached = global._mongoose
if (!cached) cached = global._mongoose = { conn: null, promise: null }

export async function connectDB(uri) {
  if (!uri) throw new Error('MONGO_URI is not set')

  // Already connected on this container — reuse it.
  if (cached.conn) return cached.conn

  // First call: kick off the connection once and remember the promise so
  // parallel calls await the same connect instead of starting new ones.
  if (!cached.promise) {
    mongoose.set('strictQuery', true)
    cached.promise = mongoose.connect(uri)
  }

  cached.conn = await cached.promise
  console.log(`MongoDB connected: ${cached.conn.connection.host}`)
  return cached.conn
}
