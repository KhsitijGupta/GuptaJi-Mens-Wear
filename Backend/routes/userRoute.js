const express = require("express");
const {
  loginUser,
  getMe,
  getAllUsers,
  deleteUser,
  completeUserProfile,
  loginWithPassword,
  signup,
  editUser,
} = require("../controllers/userController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Public Routes
router.post(
  "/completeUserProfile",
  upload.single("profileImage"),
  completeUserProfile,
);
router.post("/login", loginUser);

router.post("/passwordLogin", loginWithPassword);
// Signup route
router.post("/signup", upload.single("profileImage"), signup);

// Users
router.get(
  "/getAllUsers",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getAllUsers,
);
router.get("/getMe", authenticateUser, authorizeRoles("user"), getMe);
// router.put(
//   "/updateUserProfile/:id",
//   authenticateUser,
//   authorizeRoles("user", "admin"),
//   upload.single("userprofileImage"),
//   updateUserProfile,
// );

// PUT /api/users/:id
router.put("/editUser/:id", upload.single("profileImage"), editUser);

router.delete(
  "/deleteUser/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  deleteUser,
);

module.exports = router;
