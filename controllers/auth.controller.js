const User = require("../models/user.model");

exports.registerController = async (req, res) => {
  console.log("📩 Incoming Register Request:");
  console.log("Body:", req.body);
  const { firstName, lastName, email, password } = req.body;

  console.log("Request Body : s", req.body);

  if (!firstName || !lastName || !email || !password) {
    console.warn("⚠ Missing required fields");
    return res.status(400).json({
      success: false,
      message: "All fields (firstName, lastName, email, password) are required",
    });
  }
  try {
    console.log("🔍 Checking if user already exists with email:", email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn("⚠ User already exists:", email);
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }
    console.log("🆕 Creating new user document...");

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    console.log("✅ User created successfully:", newUser);

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("❌ Error in registerController:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
