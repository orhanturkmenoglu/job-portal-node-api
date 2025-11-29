const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Global Error:", err.stack || err);

  // Default değerler
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Duplicate key (unique constraint) hatası
  if (err.code && err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = message || `${field} "${err.keyValue[field]}" already exists`;
  }

  // 404 durumları
  if (err.statusCode === 404) {
    statusCode = 404;
    message = message || "Route not found";
  }

  // JSON yanıt
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
