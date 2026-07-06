const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  uploadCategory,
} = require("../controllers/categoryController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/uploadCategory",
  authenticateUser,
  authorizeRoles("user", "admin"),
  upload.single("categoryImage"),
  uploadCategory,
);
router.get("/getAllCategories", getAllCategories);
router.get(
  "/getCategoryById/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getCategoryById,
);
router.put(
  "/updateCategory/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  upload.single("categoryImage"),
  updateCategory,
);
router.delete(
  "/deleteCategory/:id",
  authenticateUser,
  authorizeRoles("admin"),
  deleteCategory,
);

module.exports = router;
