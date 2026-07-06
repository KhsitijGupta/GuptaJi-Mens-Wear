const express = require("express");
const router = express.Router();
const {
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  uploadSubCategory,
  getSubCategoriesByCategory,
  getSubCategoriesByCategories
} = require("../controllers/subCategoryController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload"); // <-- import upload

// Routes
router.post("/uploadSubCategory",authenticateUser,authorizeRoles("user","admin"),upload.single("subCategoryImage"), uploadSubCategory);

router.get("/getAllSubCategories", getAllSubCategories);
router.get("/getSubCategoryById/:id",authenticateUser,authorizeRoles("user","admin"), getSubCategoryById);
router.put("/updateSubCategory/:id",authenticateUser,authorizeRoles("user","admin"),upload.single("subCategoryImage"), updateSubCategory);
router.delete("/deleteSubCategory/:id",authenticateUser,authorizeRoles("user","admin"), deleteSubCategory);

// Subcategory Routes
router.get("/getSubCategoriesByCategory/:categoryId", getSubCategoriesByCategory);
// Get subcategories by multiple category IDs
router.post(
  "/getSubCategoriesByCategories",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getSubCategoriesByCategories
);

module.exports = router;
