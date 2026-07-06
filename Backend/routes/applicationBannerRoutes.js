// routes/applicationBannerRoutes.js
const express = require("express");
const upload = require("../middleware/upload");
const {
  uploadApplicationBanner,
  getAllApplicationBanners,
  deleteApplicationBanner,
  reorderApplicationBanners
} = require("../controllers/applicationBannerController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.post("/uploadApplicationBanner", authenticateUser,authorizeRoles("user","admin"), upload.single("applicationBannerImage"), uploadApplicationBanner);
router.get("/getAllApplicationBanners", authenticateUser,authorizeRoles("user","admin"), getAllApplicationBanners);
router.delete("/deleteApplicationBanner/:id", authenticateUser,authorizeRoles("user","admin"), deleteApplicationBanner);
router.post("/reorderApplicationBanner", authenticateUser,authorizeRoles("user","admin"), reorderApplicationBanners);


module.exports = router;
