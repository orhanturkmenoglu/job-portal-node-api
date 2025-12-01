const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    }
  );

  res.cookie("token", token, {
    expires: new Date(Date.now() + 86400000),
    httpOnly: true,
    secure: false,
  });

  return token;
};

module.exports = generateToken;
