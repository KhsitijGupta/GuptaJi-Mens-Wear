const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadWebsiteBanner,
  getAllWebsiteBanners,
  deleteWebsiteBanner,
} = require("../controllers/websiteBannerController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.post(
  "/uploadWebsiteBanner",
  authenticateUser,
  authorizeRoles("user", "admin"),
  upload.single("websiteBannerImage"),
  uploadWebsiteBanner
);
router.get("/getAllWebsiteBanners", getAllWebsiteBanners);
router.delete(
  "/deleteWebsiteBanner/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  deleteWebsiteBanner
);

module.exports = router;
