const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

// ✅ Signup
module.exports.signupAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ msg: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await admin.save();
    res.status(201).json({ msg: "Admin registered successfully", admin });
  } catch (err) {
    console.error("Signup error:", err);
    next(err);
  }
};

// ✅ Login
module.exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if there are any admins in the database
    const adminCount = await Admin.countDocuments();
    console.log(email);
    // If no admins exist, create the first admin automatically
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const firstAdmin = new Admin({
        name: "Super Admin",
        email: email, // use the email from login attempt
        password: hashedPassword,
        role: "admin",
      });

      await firstAdmin.save();

      const token = jwt.sign(
        { id: firstAdmin._id, role: firstAdmin.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        message: "First admin created and logged in",
        token,
        admin: firstAdmin,
      });
    }

    // Regular login flow
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ msg: "Login successful", token, admin });
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

// ✅ Profile
module.exports.getAdminProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    res.json({ msg: "Admin profile fetched successfully", admin });
  } catch (err) {
    console.error("Profile error:", err);
    next(err);
  }
};

// ✅ All Admins
module.exports.getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    console.error("Fetch admins error:", err);
    next(err);
  }
};
