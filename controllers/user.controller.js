const User = require ("../models/user.model")

exports.updateUserController = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {
    console.log("📩 Incoming updateUser request:", req.body);

    if (!firstName || !lastName || !email) {
      console.warn("⚠ Missing required fields");
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ _id: req.user.userId }).select("-password");
    if (!user) {
      console.warn("❌ User not found for ID:", req.user.userId);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("🔄 Updating user fields...");
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    await user.save();

     return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server",
    });
  }
};
