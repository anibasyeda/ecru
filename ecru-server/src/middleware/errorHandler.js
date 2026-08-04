// Catches any route that didn't match, so unknown URLs return JSON (not HTML).
export function notFound(req, res, next) {
  res.status(404)
  next(new Error(`Route not found: ${req.originalUrl}`))
}

// Central error handler. Controllers set res.status(...) then throw; this
// turns that into a consistent JSON shape. Stack is hidden in production.
export function errorHandler(err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}
