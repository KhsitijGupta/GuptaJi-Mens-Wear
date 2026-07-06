const express = require("express");
const {
  uploadBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const upload = require("../middleware/upload");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.post("/uploadBlog", authenticateUser,authorizeRoles("user","admin"), upload.single("blogImage"), uploadBlog);
router.get("/getAllBlogs", authenticateUser,authorizeRoles("user","admin"), getAllBlogs);
router.put("/updateBlog/:id", authenticateUser,authorizeRoles("user","admin"), upload.single("blogImage"), updateBlog);
router.delete("/deleteBlog/:id", authenticateUser,authorizeRoles("user","admin"), deleteBlog);

module.exports = router;
