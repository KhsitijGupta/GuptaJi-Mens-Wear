const Blog = require("../models/Blog");
const { uploadFile } = require("../services/cloudinaryService");

// Upload Blog
module.exports.uploadBlog = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    const image = req.file
      ? (await uploadFile(req.file.path, "blog")).secure_url
      : null;

    const blog = new Blog({ title, date, description, link, image });
    await blog.save();

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Error uploading blog", error });
  }
};

// Get all blogs
module.exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs", error });
  }
};

// Update blog
module.exports.updateBlog = async (req, res) => {
  try {
    const { title, date, description, link } = req.body;
    const updateData = { title, date, description, link };

    // Only update image if a new file is uploaded
    if (req.file) {
      updateData.image = (await uploadFile(req.file.path, "blog")).secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }, // return updated document
    );

    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: "Error updating blog", error });
  }
};

// Delete blog
module.exports.deleteBlog = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog", error });
  }
};
