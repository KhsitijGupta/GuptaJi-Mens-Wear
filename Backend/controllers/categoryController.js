const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const SubCategory = require("../models/SubCategory");
const Cart = require("../models/Cart");
const wishlist = require("../models/wishlist");
const { uploadFile } = require("../services/cloudinaryService");

// @desc    Upload a new category with image
// @route   POST /api/categories/upload
module.exports.uploadCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    let { categoryId, categoryName, description, subCategories } = req.body;
    console.log(req.body);

    // ✅ Auto-generate categoryId from last entry
    if (!categoryId) {
      const lastCategory = await Category.findOne().sort({ _id: -1 }); // last inserted
      if (lastCategory && lastCategory.categoryId) {
        // extract number part from id (e.g., mmcat0005 → 5)
        const lastNumber = parseInt(
          lastCategory.categoryId.replace("ZKCAT", ""),
          10,
        );
        categoryId = `ZKCAT${String(lastNumber + 1).padStart(4, "0")}`;
      } else {
        // first category
        categoryId = "ZKCAT0001";
      }
    }

    const uploadedImage = await uploadFile(req.file, "category");
    const newCategory = new Category({
      categoryName,
      description,
      image: uploadedImage.secure_url,
      subCategories,
      categoryId,
    });

    await newCategory.save();
    console.log(newCategory);

    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new category (without image upload)
// @route   POST /api/categories
module.exports.createCategory = async (req, res) => {
  try {
    const { categoryName, description, image, subCategories } = req.body;

    let { categoryId } = req.body;
    if (!categoryId) {
      const count = await Category.lastCategory();
      categoryId = `mmcat${String(count + 1).padStart(4, "0")}`;
    }

    const newCategory = new Category({
      categoryName,
      description,
      image,
      subCategories,
      categoryId,
    });

    await newCategory.save();
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .populate("subCategories");
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
module.exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate(
      "subCategories",
    );
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @desc    Update category (with image replace + old delete)
// @route   PUT /api/categories/:id
module.exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // Body ko safe access karo
    const { categoryName, description, subCategories } = req.body || {};

    let updateData = {
      categoryName: categoryName || category.categoryName,
      description: description || category.description,
      subCategories: subCategories || category.subCategories,
    };

    // ✅ Agar nayi image upload hui hai
    if (req.file) {
      updateData.image = (await uploadFile(req.file, "category")).secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("Update Category Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category + image file
// @route   DELETE /api/categories/:id
module.exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // 1️⃣ Find all subcategories of this category
    const subCategories = await SubCategory.find({ categoryId: category._id });

    for (let sub of subCategories) {
      // 2️⃣ Find all products of this subcategory
      const products = await Product.find({ subCategoryId: sub._id });

      for (let product of products) {
        // 🗑 Delete product images
        if (product.productImage?.length) {
          product.productImage.forEach((img) => {
            const imgPath = path.join(__dirname, "..", img);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
          });
        }

        // 🗑 Remove from wishlist
        await wishlist.updateMany(
          {},
          { $pull: { products: { productId: product._id } } },
        );

        // 🗑 Remove from cart
        const carts = await Cart.find({ "items.productId": product._id });

        for (let cart of carts) {
          cart.items = cart.items.filter(
            (item) => item.productId.toString() !== product._id.toString(),
          );

          cart.totalAmount = cart.items.reduce(
            (sum, item) => sum + item.totalPrice,
            0,
          );

          cart.payableAmount =
            cart.totalAmount + cart.deliveryCharges - cart.coinsUsed;

          await cart.save();
        }

        // 🗑 Delete product
        await Product.findByIdAndDelete(product._id);
      }

      // 🗑 Delete subcategory image
      if (sub.image) {
        const filePath = path.join(__dirname, "..", sub.image);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      }

      // 🗑 Delete subcategory
      await SubCategory.findByIdAndDelete(sub._id);
    }

    // 🗑 Delete category image
    if (category.image) {
      const filePath = path.join(__dirname, "..", category.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    // 🗑 Delete category
    await Category.findByIdAndDelete(category._id);

    res.status(200).json({
      success: true,
      message: "Category, SubCategories & Products deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
