// Wraps an async route handler so any rejected promise is forwarded to the
// Express error middleware. This is the reason no controller below needs a
// try/catch — errors bubble to one place.
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)
