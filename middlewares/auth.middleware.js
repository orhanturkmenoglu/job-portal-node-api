const JWT = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  try {
    let token = null;

    // 1) Bearer Token
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2) Cookie Token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // Token yoksa
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token not provided",
      });
    }

    // Token doğrula
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı request'e ekle
    req.user = { userId: decoded.userId };

    next();
  } catch (err) {
    console.error("❌ JWT Error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token",
    });
  }
};

module.exports = userAuth;
