const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAddressUserId,
  updateAddressId,
  deleteAddressId,
} = require("../controllers/addressController.js");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post(
  "/createAddress",
  authenticateUser,
  authorizeRoles("user"),
  createAddress,
); // Create a new address
router.get(
  "/getAddressUserId",
  authenticateUser,
  authorizeRoles("user"),
  getAddressUserId,
); // Get all addresses for a user by userId
router.put(
  "/updateAddressId/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  updateAddressId,
); // Update address by addressId
router.delete(
  "/deleteAddressId/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  deleteAddressId,
); // Delete address by addressId

module.exports = router;
