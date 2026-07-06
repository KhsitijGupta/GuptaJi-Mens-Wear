const SubCategory = require("../models/SubCategory");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const wishlist = require("../models/wishlist");
const Cart = require("../models/Cart");

// -----------------------------
// @desc    Upload a new subcategory with image
// @route   POST /api/subcategories/upload
// -----------------------------
module.exports.uploadSubCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const { subCategoryName, description, categoryId, products } = req.body;

    // ✅ Check parent category exists
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Parent category not found" });
    }

    // ✅ Auto-generate subCategoryId
    let subCategoryId;
    const lastSubCategory = await SubCategory.findOne().sort({ _id: -1 });
    if (lastSubCategory && lastSubCategory.subCategoryId) {
      const lastNumber = parseInt(
        lastSubCategory.subCategoryId.replace("ZKSCAT", ""),
        10,
      );
      subCategoryId = `ZKSCAT${String(lastNumber + 1).padStart(4, "0")}`;
    } else {
      subCategoryId = "ZKSCAT0001";
    }

    const newSubCategory = new SubCategory({
      subCategoryName,
      description,
      image: `/uploads/Subcategory/${req.file.filename}`, // ✅ relative path
      categoryId,
      products,
      subCategoryId,
    });

    await newSubCategory.save();

    // ✅ Push into parent category
    parentCategory.subCategories.push(newSubCategory._id);
    await parentCategory.save();

    res.status(201).json({ success: true, data: newSubCategory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// @desc    Get all subcategories
// @route   GET /api/subcategories
// -----------------------------
// module.exports.getAllSubCategories = async (req, res) => {
//   try {
//     const subCategories = await SubCategory.find()
//       .populate("categoryId", "categoryName categoryId")
//       .populate("products");
//     res.status(200).json({ success: true, data: subCategories });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

module.exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .sort({ createdAt: -1 })
      .populate("categoryId", "categoryName");

    res.status(200).json({ success: true, data: subCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// @desc    Get single subcategory
// @route   GET /api/subcategories/:id
// -----------------------------
module.exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id)
      .sort({ createdAt: -1 })
      .populate("categoryId", "categoryName categoryId")
      .populate("products");

    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    res.status(200).json({ success: true, data: subCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// @desc    Update subcategory (with optional image)
// @route   PUT /api/subcategories/:id
// -----------------------------
module.exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    // ✅ If new image uploaded → delete old one
    if (req.file) {
      if (subCategory.image) {
        const oldPath = path.join(
          __dirname,
          "..",
          subCategory.image, // image = uploads/subcategory/filename.jpg
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.image = `/uploads/Subcategory/${req.file.filename}`;
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    )
      .populate("categoryId", "categoryName categoryId")
      .populate("products");

    res.status(200).json({ success: true, data: updatedSubCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------
// @desc    Delete subcategory (with image)
// @route   DELETE /api/subcategories/:id
// -----------------------------
module.exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);

    if (!subCategory) {
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });
    }

    // 1️⃣ Get products of this subcategory
    const products = await Product.find({ subCategoryId: subCategory._id });

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

      await Product.findByIdAndDelete(product._id);
    }

    // 🗑 Remove from parent category
    await Category.findByIdAndUpdate(subCategory.categoryId, {
      $pull: { subCategories: subCategory._id },
    });

    // 🗑 Delete subcategory image
    if (subCategory.image) {
      const filePath = path.join(__dirname, "..", subCategory.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await SubCategory.findByIdAndDelete(subCategory._id);

    res.status(200).json({
      success: true,
      message: "SubCategory & its Products deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/subcategory/getSubCategoriesByCategory/:categoryId
module.exports.getSubCategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find all subcategories with this categoryId
    const subCategories = await SubCategory.find({ categoryId }).populate(
      "categoryId",
    );
    const categoryName = subCategories[0]?.categoryId?.categoryName;
    res.status(200).json({ success: true, subCategories, categoryName });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------
// @desc    Get subcategories by multiple categories
// @route   POST /api/subcategory/getSubCategoriesByCategories
// ---------------------------------------------
module.exports.getSubCategoriesByCategories = async (req, res) => {
  try {
    const { categoryIds } = req.body;

    // ✅ Validation
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "categoryIds must be a non-empty array",
      });
    }

    // ✅ Fetch subcategories
    const subCategories = await SubCategory.find({
      categoryId: { $in: categoryIds },
    })
      .sort({ createdAt: -1 })
      .populate("categoryId", "categoryName categoryId");

    res.status(200).json({
      success: true,
      count: subCategories.length,
      data: subCategories,
    });
  } catch (error) {
    console.error("Get SubCategories By Categories Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
