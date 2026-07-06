const express = require("express");
const { signupAdmin, loginAdmin, getAdminProfile, getAllAdmins } = require("../controllers/adminController.js");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

// Public Routes
router.post("/signup", signupAdmin);

router.post("/login", loginAdmin);

// Protected Routes
router.get("/adminProfile",  getAdminProfile);
router.get("/allAdmin",  getAllAdmins);

module.exports = router;
