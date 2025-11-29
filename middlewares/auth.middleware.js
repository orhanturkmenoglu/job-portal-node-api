const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // doğru isim

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("⚠ Authorization header missing or invalid");
      return res.status(401).json({ message: "Unauthorized: Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const payload = JWT.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { userId: payload.userId };

    next();
  } catch (err) {
    console.error("❌ JWT verification failed:", err.message);
    return res.status(401).json({ message: "Unauthorized: Token verification failed" });
  }
};

module.exports = userAuth;
