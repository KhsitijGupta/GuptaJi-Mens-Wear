const express = require("express");
const router = express.Router();
const {
  addToCart,
  getAllCart,
  updateCartItem,
  removeCart,
  getCartItemById,
  decreaseCartItemQuantity,
} = require("../controllers/cartController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post("/addToCart", authenticateUser, authorizeRoles("user"), addToCart);
router.get("/getMyCart", authenticateUser, authorizeRoles("user"), getAllCart);
router.put(
  "/updateCartItem",
  authenticateUser,
  authorizeRoles("admin", "user"),
  updateCartItem,
);
router.delete(
  "/removeCart",
  authenticateUser,
  authorizeRoles("admin", "user"),
  removeCart,
);
router.put(
  "/removeCartItem",
  authenticateUser,
  authorizeRoles("user"),
  decreaseCartItemQuantity,
);
router.get(
  "/getCartItemById/:userId/:productId",
  authenticateUser,
  authorizeRoles("admin", "user"),
  getCartItemById,
);

module.exports = router;
