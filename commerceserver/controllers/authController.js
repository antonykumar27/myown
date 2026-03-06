// controllers/userController.js
const User = require("../models/User");
const ErrorHandler = require("../middleware/errorHandler");
const bcrypt = require("bcryptjs");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../middleware/jwt");
// Register new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  console.log("");
  // 1️⃣ Validate input
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // 2️⃣ Find user + include password
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // 3️⃣ Compare password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // 4️⃣ Check active status (optional but recommended)

  // ❌ remove password before response
  user.password = undefined;

  // 5️⃣ Send token
  sendToken(user, 200, res);
});

module.exports = {
  registerUser,
  loginUser,
};
