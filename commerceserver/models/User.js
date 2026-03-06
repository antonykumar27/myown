const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically create 'createdAt' and 'updatedAt' fields
  },
);

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Salt rounds set to 10
  next();
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Compare password method for login
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ ADD THIS METHOD - Generate JWT Token
// Generate JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      tier: this.tier,
      isPremium: this.isPremium,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
};

module.exports = mongoose.model("User", userSchema);
