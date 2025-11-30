const JWT = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // doğru isim
    let token ;

    if (authHeader && authHeader.startsWith("Bearer ")) {
     token = req.headers.authorization.split(" ")[1];
    }

    if(!token && req.cookies && req.cookies.token){
      token = req.cookies.token;
    }

     if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Token not provided",
      });
    }
    
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
