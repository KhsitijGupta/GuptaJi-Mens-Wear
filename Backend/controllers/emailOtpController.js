const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const DeliveryPerson = require("../models/DeliveryPerson");
const User = require("../models/User");
const Otp = require("../models/Otp");
const Fire = require("../models/fireModel");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 📩 Send OTP
module.exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (email === "user@test.com" || email === "delivery@test.com") {
    return res.status(200).json({
      success: true,
      message: "Static OTP sent successfully.",
    });
  }
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB (remove old one if exists)
    await Otp.findOneAndDelete({ email });
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    await sendMail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// 🔑 Verify OTP (common function)
const verifyOtp = async (email, otp) => {
  const record = await Otp.findOne({ email });
  if (!record) return false;
  if (record.expiresAt < Date.now()) {
    await Otp.deleteOne({ email });
    return false;
  }
  if (record.otp !== otp) return false;

  await Otp.deleteOne({ email });
  return true;
};

module.exports.verifyUserOtp = async (req, res) => {
  try {
    const STATIC_EMAIL = "user@test.com";
    const STATIC_OTP = "111111";

    const { email, otp, fcmToken } = req.body;

    // ================================
    // STATIC USER LOGIN BLOCK
    // ================================
    if (email === STATIC_EMAIL) {
      if (otp !== STATIC_OTP) {
        return res.status(400).json({ message: "Invalid static OTP" });
      }

      // Dummy static user
      const staticUser = {
        _id: "68dd0ab48c61bded86408307",
        fullName: "Static User",
        email: STATIC_EMAIL,
        role: "user",
      };

      // Save FCM token for static user
      if (fcmToken) {
        const existingToken = await Fire.findOne({ userId: staticUser._id });

        if (!existingToken) {
          await Fire.create({
            userId: staticUser._id,
            fcmToken,
          });
        }
      }

      const token = jwt.sign(
        { id: staticUser._id, role: staticUser.role },
        JWT_SECRET,
        { expiresIn: "30d" },
      );

      return res.status(200).json({
        message: "Static user login successful",
        token,
        role: staticUser.role,
        data: staticUser,
      });
    }

    // ================================
    // NORMAL OTP LOGIN BLOCK
    // ================================
    const valid = await verifyOtp(email, otp);
    if (!valid)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "No user found with this email",
        role: "guest",
      });
    }

    // Save FCM token for normal user
    if (fcmToken) {
      await Fire.findOneAndUpdate(
        { userId: user._id },
        { fcmToken },
        { upsert: true, new: true },
      );
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      message: "User login successful",
      token,
      role: user.role,
      data: user,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports.verifyDeliveryPersonOtp = async (req, res) => {
  try {
    const STATIC_EMAIL = "delivery@test.com";
    const STATIC_OTP = "111111";

    const { email, otp, fcmToken } = req.body;

    // =====================================================
    // STATIC LOGIN
    // =====================================================
    if (email === STATIC_EMAIL) {
      if (otp !== STATIC_OTP) {
        return res.status(400).json({ message: "Invalid static OTP" });
      }

      const staticDeliveryPerson = {
        _id: "68ce69ef58d9128870714da7",
        fullName: "Static Delivery",
        email: STATIC_EMAIL,
        role: "delivery_person",
      };

      // Save FCM token for static delivery person
      if (fcmToken) {
        const exists = await Fire.findOne({ userId: staticDeliveryPerson._id });

        if (!exists) {
          await Fire.create({
            userId: staticDeliveryPerson._id,
            fcmToken,
          });
        }
      }

      const token = jwt.sign(
        { id: staticDeliveryPerson._id, role: staticDeliveryPerson.role },
        JWT_SECRET,
        { expiresIn: "30d" },
      );

      return res.status(200).json({
        message: "Static delivery person login successful",
        token,
        role: staticDeliveryPerson.role,
        data: staticDeliveryPerson,
      });
    }

    // =====================================================
    // NORMAL OTP LOGIN
    // =====================================================
    const valid = await verifyOtp(email, otp);
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const deliveryPerson = await DeliveryPerson.findOne({ email });
    if (!deliveryPerson) {
      return res.json({
        message: "Delivery person not found",
        data: null,
      });
    }

    // Save FCM token for a real delivery person
    if (fcmToken) {
      await Fire.findOneAndUpdate(
        { userId: deliveryPerson._id },
        { fcmToken },
        { upsert: true, new: true },
      );
    }

    const token = jwt.sign(
      { id: deliveryPerson._id, role: deliveryPerson.role },
      JWT_SECRET,
      { expiresIn: "30d" },
    );

    return res.status(200).json({
      message: "Delivery person login successful",
      token,
      role: deliveryPerson.role,
      data: deliveryPerson,
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};
