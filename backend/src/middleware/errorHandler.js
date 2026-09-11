export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
}

export function errorHandler(error, req, res, next) {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(', ') });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid record identifier' });
  }
  console.error(error);
  return res.status(500).json({ success: false, message: 'Something went wrong on the server' });
}
