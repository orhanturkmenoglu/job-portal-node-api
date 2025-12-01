const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.registerController = async (req, res, next) => {
  console.log("📩 Incoming Register Request:");
  console.log("Body:", req.body);

  const { firstName, lastName, email, password } = req.body;

  console.log("Request Body : s", req.body);

  if (!firstName || !lastName || !email || !password) {
    console.warn("⚠ Missing required fields");
    return next(
      "All fields (firstName, lastName, email, password) are required"
    );
  }

  console.log("🔍 Checking if user already exists with email:", email);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.warn("⚠ User already exists:", email);
    return next(`Email "${email}" is already registered`);
  }
  console.log("🆕 Creating new user document...");

  // Hash password (async best practice)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  console.log("✅ User created successfully:", newUser);

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      location: newUser.location,
    },
  });
};

exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      console.log("⚠ Missing email or password");
      return next("Email and password are required!");
    }

    console.log("🔍 Checking user with email:", email);

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      console.warn("❌ User not found:", email);
      return next("User not found!");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("❌ Incorrect password attempt:", email);
      return next("Incorrect password, please try again!");
    }

    // Remove password from response
    user.password = undefined;

    // Generate JWT
    const token = generateToken(user._id,res);

    console.log("✅ Login successful:", email);

    // Send JWT in HTTP-only cookie

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    next(error);
  }
};

exports.logoutController = async (req, res) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message:
        "Logout successful. Please remove token from Authorization header on client.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
