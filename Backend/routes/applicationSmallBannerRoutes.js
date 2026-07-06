// routes/applicationBannerRoutes.js
const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadApplicationSmallBanner,
  getAllApplicationSmallBanners,
  deleteApplicationSmallBanner,
  reorderApplicationSmallBanners
} = require("../controllers/applicationSmallBannerController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/uploadApplicationSmallBanner", authenticateUser,authorizeRoles("user","admin"), upload.single("applicationSmallBannerImage"), uploadApplicationSmallBanner);
router.get("/getAllApplicationSmallBanners", authenticateUser,authorizeRoles("user","admin"), getAllApplicationSmallBanners);
router.delete("/deleteApplicationSmallBanner/:id", authenticateUser,authorizeRoles("user","admin"), deleteApplicationSmallBanner);
router.post("/reorderApplicationSmallBanner", authenticateUser,authorizeRoles("user","admin"), reorderApplicationSmallBanners);

module.exports = router;
