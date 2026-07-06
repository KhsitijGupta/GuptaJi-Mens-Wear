const express = require("express");
const router = express.Router();
const {
  updateProduct,
  deleteProduct,
  uploadProduct,
  getAllProducts,
  getProductById,
  getPriceByUnit,
  getProductsBySubCategory,
  getSuggestedProducts,
  getSomeProducts,
  getProductsBySubCategories,
  searchProducts,
} = require("../controllers/productController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload"); // <-- import upload

// router.post("/uploadProduct",authenticateUser,authorizeRoles("admin"), upload.single("productImage"), uploadProduct)

router.post(
  "/uploadProduct",
  authenticateUser,
  authorizeRoles("admin"),
  upload.array("productImage", 10),
  uploadProduct,
);

// Product Routes
router.get(
  "/getAllProducts",

  getAllProducts,
);
router.get(
  "/getSomeProducts",
  // authenticateUser,
  // authorizeRoles("admin", "user"),
  getSomeProducts,
);
router.get("/getProductById/:id", getProductById);
router.get("/search", searchProducts);
router.get(
  "/getAllProductsBySuggestion",
  authenticateUser,
  authorizeRoles("user"),
  getSuggestedProducts,
);
router.put(
  "/updateProduct/:id",
  authenticateUser,
  authorizeRoles("admin", "user"),
  upload.array("productImage", 10),
  updateProduct,
); //admin
router.delete(
  "/deleteProduct/:id",
  authenticateUser,
  authorizeRoles("admin", "user"),
  deleteProduct,
); //admin

// nit-based price
router.post(
  "/getPriceByUnit/:id",
  authenticateUser,
  authorizeRoles("admin", "user"),
  getPriceByUnit,
);

// Product Routes
router.get(
  "/getProductsBySubCategory/:subCategoryId",
  getProductsBySubCategory,
);
// POST /api/products/getProductsBySubCategories
router.post(
  "/getProductsBySubCategories",
  authenticateUser,
  getProductsBySubCategories,
);

module.exports = router;
