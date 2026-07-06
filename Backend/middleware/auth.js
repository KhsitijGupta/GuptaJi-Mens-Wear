const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.js");
const User = require("../models/User.js");
const DeliveryPerson = require("../models/DeliveryPerson.js");

const authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await Admin.findById(decoded.id).select("-password");
      console.log(req.user);
      if (req.user === null) {
        req.user = await User.findById(decoded.id).select("");
      }
      if (req.user === null) {
        req.user = await DeliveryPerson.findById(decoded.id).select("");
      }
      if (!req.user) {
        return res.status(401).json({ message: "User Not Found" });
      }
      next();
    } catch (err) {
      console.log("Auth Middleware Error : ", err.message);
      res.status(401).json({ message: " Not Authorized , token failed" });
    }
  } else {
    res.status(401).json({ message: " No token , authorization denied" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // ✅ Guest allowed without token
    if (!req.user) {
      if (allowedRoles.includes("guest")) {
        req.user = { role: "guest" }; // optional, consistency ke liye
        return next();
      }

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ✅ Logged-in user role check
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateUser,
  authorizeRoles,
};
