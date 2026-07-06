const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist } = require("../controllers/wishlistController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

// Get wishlist
router.get("/getWishlist", authenticateUser,authorizeRoles("user"), getWishlist);

// Toggle product in wishlist
router.post("/toggleWishlist",authenticateUser,authorizeRoles("user"), toggleWishlist);

module.exports = router;
