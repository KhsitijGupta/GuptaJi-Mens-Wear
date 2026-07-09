const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Address = require("../models/Address");
const sendMail = require("../utils/sendMail");
const { uploadFile } = require("../services/cloudinaryService");
const fs = require("fs");
const path = require("path");

const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// Temporary OTP store (in production -> use Redis/DB)
const otpStore = new Map();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports.completeUserProfile = async (req, res) => {
  try {
    const { fullName, email, phone, gender, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !password) {
      return res
        .status(400)
        .json({ msg: "All required fields must be filled" });
    }

    const normalizedGender = gender ? gender.toLowerCase() : undefined;

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });
    }

    // Check existing phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res
        .status(400)
        .json({ msg: "User already exists with this phone" });
    }

    let profileImage = null;
    if (req.file) {
      profileImage = (await uploadFile(req.file, "users/profileImage"))
        .secure_url;
    }

    // ✅ Create user with password
    const user = new User({
      fullName,
      email,
      phone,
      password,
      profileImage,
      gender: normalizedGender,
      role: "user",
    });

    await user.save();

    res.status(201).json({
      msg: "User registered successfully",
      token: generateToken(user),
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, gender } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and password are required",
      });
    }

    // Check email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Check phone
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this phone number",
      });
    }

    // Generate Custom UserId
    const lastUser = await User.findOne().sort({ userId: -1 });

    let newUserId = "ZKUSR0001";

    if (lastUser && lastUser.userId) {
      const lastNumber = parseInt(lastUser.userId.replace("ZKUSR", ""));
      const nextNumber = lastNumber + 1;
      newUserId = "ZKUSR" + String(nextNumber).padStart(4, "0");
    }

    // Handle profile image
    let profileImage = null;
    if (req.file) {
      profileImage = (await uploadFile(req.file, "users/profileImage"))
        .secure_url;
    }

    const normalizedGender = gender ? gender.toLowerCase() : undefined;

    // Create user
    const user = new User({
      userId: newUserId,
      fullName,
      email,
      phone,
      password,
      profileImage,
      gender: normalizedGender,
      role: "user",
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Signup successful",
      token,
      user: {
        _id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while signing up",
      error: error.message,
    });
  }
};

// Update User
module.exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id; // User ID from URL
    const { fullName, email, phone, password, gender } = req.body;

    // 1️⃣ Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Check if email is being updated and is unique
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      user.email = email;
    }

    // 3️⃣ Check if phone is being updated and is unique
    if (phone && phone !== user.phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already in use",
        });
      }
      user.phone = phone;
    }

    // 4️⃣ Update other fields
    if (fullName) user.fullName = fullName;
    if (gender) user.gender = gender;

    // 5️⃣ Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 6️⃣ Handle profile image if using file upload
    if (req.file) {
      user.profileImage = (
        await uploadFile(req.file, "users/profileImage")
      ).secure_url;
    }

    // 7️⃣ Save changes
    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Edit user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating user",
      error: error.message,
    });
  }
};

module.exports.loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Request OTP (15 min expiry)
module.exports.requestOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry
    otpStore.set(email, { otp, expiresAt: Date.now() + 15 * 60 * 1000 });

    // Send OTP via email
    await sendMail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    res.json({ msg: "OTP sent to email, valid for 15 minutes" });
  } catch (error) {
    console.error("Request OTP error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports.loginUser = async (req, res) => {
  return module.exports.loginWithPassword(req, res);
};
module.exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Populate referenced address documents
    const user = await User.findById(userId)
      .sort({ createdAt: -1 })
      .populate("address");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optional: sanitize data (remove sensitive info)
    const userProfile = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
      coins: user.coins,
      profileImage: user.profileImage,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      address:
        user.address?.map((addr) => ({
          _id: addr._id,
          country: addr.country,
          state: addr.state,
          city: addr.city,
          pincode: addr.pincode,
          landmark: addr.landmark,
          addressType: addr.addressType,
          isDefault: addr.isDefault,
        })) || [],
    };

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user: userProfile,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
      error: error.message,
    });
  }
};

module.exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Populate address so full details (country, state, city, etc.) appear
    const user = await User.findById(userId).populate("address");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user profile",
      error: error.message,
    });
  }
};

// Delete User
module.exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Find user first
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2️⃣ Delete user profile image from uploads folder
    if (user.profileImage && user.profileImage.startsWith("/uploads/")) {
      const imagePath = path.join(__dirname, "..", user.profileImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑️ Deleted image:", imagePath);
      } else {
        console.log("⚠️ Image not found, skipping:", imagePath);
      }
    }

    // 3️⃣ Delete user from DB
    await User.findByIdAndDelete(userId);

    return res.json({ msg: "User deleted successfully & image removed" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).populate("address"); // ✅ populate address details
    res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
