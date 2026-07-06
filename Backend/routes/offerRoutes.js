const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer,
  applyOfferToProducts,
  toggleOfferStatus,
} = require("../controllers/offerController.js");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

// Routes
router.post(
  "/createOffer",
  authenticateUser,
  authorizeRoles("user", "admin"),
  upload.single("offerImage"),
  createOffer
); // Multer se single image
router.get(
  "/getAllOffers",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getAllOffers
);
router.get(
  "/getOfferById/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getOfferById
);
router.post(
  "/toggleOfferStatus/:_id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  toggleOfferStatus
);
router.post(
  "/apply-offer",
  authenticateUser,
  authorizeRoles("user", "admin"),
  applyOfferToProducts
);
router.put(
  "/updateOffer/:offerId",
  authenticateUser,
  authorizeRoles("user", "admin"),
  upload.single("offerImage"),
  updateOffer
);
router.delete(
  "/deleteOffer/:offerId",
  authenticateUser,
  authorizeRoles("user", "admin"),
  deleteOffer
);

module.exports = router;
