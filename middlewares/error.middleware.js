const errorMiddleware = (err, req, res, next) => {
  console.error("❌ Error:", err.stack || err);

  const message = err.message || "Something went wrong!";

  res.status(500).json({
    success: false,
    message,
    err
  });
};

module.exports = errorMiddleware;
