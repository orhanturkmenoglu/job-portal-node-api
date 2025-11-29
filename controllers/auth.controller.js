const User = require("../models/user.model");

exports.registerController = async (req, res, next) => {
  console.log("📩 Incoming Register Request:");
  console.log("Body:", req.body);

  const { firstName, lastName, email, password } = req.body;

  console.log("Request Body : s", req.body);

  if (!firstName || !lastName || !email || !password) {
    console.warn("⚠ Missing required fields");
    next("All fields (firstName, lastName, email, password) are required");
  }

  console.log("🔍 Checking if user already exists with email:", email);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.warn("⚠ User already exists:", email);
    next(`Email "${email}" is already registered`);
  }
  console.log("🆕 Creating new user document...");

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  console.log("✅ User created successfully:", newUser);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: newUser,
  });
};
