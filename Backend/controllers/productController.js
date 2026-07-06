// controllers/suggestionController.js
const Order = require("../models/Order");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const cron = require("node-cron");
const Wishlist = require("../models/wishlist");
const Cart = require("../models/Cart");

// @desc    Upload product with multiple images, pricing, features, stock
// @route   POST /api/products/upload
module.exports.uploadProduct = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No images uploaded" });
    }

    const {
      productName,
      description,
      pricing, // array or JSON string [{ unit, price, value }]
      categoryId,
      subCategoryId,
      validity,
      isLowMargin,
      feature,
      features, // optional array
      stock,
      trustedQuality,
      deliveryTime,
      returnPolicy,
      sourcedFreshDaily,
    } = req.body;

    // Validate category & subcategory
    const parentCategory = await Category.findById(categoryId);
    if (!parentCategory)
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });

    const parentSubCategory = await SubCategory.findById(subCategoryId);
    if (!parentSubCategory)
      return res
        .status(404)
        .json({ success: false, message: "SubCategory not found" });

    // Generate productId
    const lastProduct = await Product.findOne().sort({ _id: -1 });
    const productId =
      lastProduct && lastProduct.productId
        ? `ZKPRO${String(
            parseInt(lastProduct.productId.replace("ZKPRO", ""), 10) + 1,
          ).padStart(4, "0")}`
        : "ZKPRO0001";

    // Map uploaded files to image paths
    const productImage = req.files.map(
      (file) => `/uploads/product/${file.filename}`,
    );

    // // Parse pricing
    // let pricingArray = [];
    // if (pricing) {
    //   if (typeof pricing === "string") pricingArray = JSON.parse(pricing);
    //   else if (Array.isArray(pricing)) pricingArray = pricing;
    // }

    // let discountedPrice = null;

    // if (discount && pricingArray.length > 0) {
    //   const basePrice = Number(pricingArray[0].price); // first unit price
    //   const discountPercent = Number(discount);

    //   discountedPrice = basePrice - (basePrice * discountPercent) / 100;
    // }

    // Parse features
    let featuresArray = [];
    if (features) {
      if (typeof features === "string") featuresArray = JSON.parse(features);
      else if (Array.isArray(features)) featuresArray = features;
    }
    // ---- Parse pricing ----
    let pricingArray = [];
    if (pricing) {
      pricingArray =
        typeof pricing === "string" ? JSON.parse(pricing) : pricing;
    }

    // ---- Calculate discount from price & discountedPrice ----
    let discount = 0;
    let discountedPrice = null;

    if (pricingArray.length > 0) {
      const basePrice = Number(pricingArray[0].price);
      const finalPrice = Number(pricingArray[0].discountedPrice);

      if (finalPrice > 0 && finalPrice < basePrice) {
        discount = Number(
          (((basePrice - finalPrice) / basePrice) * 100).toFixed(2),
        );
        discountedPrice = finalPrice;
      }
    }
    if (pricingArray.some((p) => Number(p.discountedPrice) > Number(p.price))) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than price",
      });
    }

    const newProduct = new Product({
      productName,
      description,
      productImage,
      pricing: pricingArray.map((p) => ({
        unit: p.unit,
        price: Number(p.price),
        value: Number(p.value || 0),
      })),
      categoryId,
      subCategoryId,
      validity,
      discount, // 👈 calculated here
      discountedPrice, // 👈 derived value

      feature: feature === "true" || feature === true,
      features: featuresArray,
      stock: Number(stock) || 0,
      productId,

      // ✅ NEW FIELDS
      isLowMargin: isLowMargin === "true" || isLowMargin === true,

      trustedQuality: trustedQuality === "true" || trustedQuality === true,
      deliveryTime: deliveryTime || "24 hours",
      returnPolicy: returnPolicy || "Return Assumed",
      sourcedFreshDaily:
        sourcedFreshDaily === "true" || sourcedFreshDaily === true,
    });

    await newProduct.save();
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName");

    res.status(201).json({ success: true, data: populatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const {
      productName,
      description,
      categoryId,
      subCategoryId,
      validity,
      feature,
      pricing,
      discountedPrice,
      removedImages,
      features,
      isLowMargin,
      stock,
      trustedQuality,
      deliveryTime,
      returnPolicy,
      sourcedFreshDaily,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    /* ================= IMAGE REMOVAL ================= */
    if (removedImages) {
      const removedArr = JSON.parse(removedImages);

      product.productImage = product.productImage.filter(
        (img) => !removedArr.includes(img),
      );

      removedArr.forEach((imgUrl) => {
        const filePath = path.join(__dirname, "..", imgUrl);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
    }

    /* ================= IMAGE ADD ================= */
    if (req.files?.length > 0) {
      const newImages = req.files.map(
        (file) => `/uploads/product/${file.filename}`,
      );
      product.productImage.push(...newImages);
    }

    /* ================= BASIC FIELDS ================= */
    product.productName = productName ?? product.productName;
    product.description = description ?? product.description;
    product.categoryId = categoryId ?? product.categoryId;
    product.subCategoryId = subCategoryId ?? product.subCategoryId;
    product.validity = validity ?? product.validity ?? "";
    product.stock = stock !== undefined ? Number(stock) : product.stock;

    product.feature =
      feature !== undefined
        ? feature === "true" || feature === true
        : product.feature;

    product.isLowMargin =
      isLowMargin !== undefined
        ? isLowMargin === "true" || isLowMargin === true
        : product.isLowMargin;

    /* ================= PRICING (CORE FIX) ================= */
    if (pricing) {
      const pricingArr =
        typeof pricing === "string" ? JSON.parse(pricing) : pricing;

      const basePrice = Number(pricingArr[0].price);
      const finalPrice = Number(pricingArr[0].discountedPrice);

      // 🔒 Validation
      if (finalPrice > basePrice) {
        return res.status(400).json({
          message: "Discounted price cannot be greater than price",
        });
      }

      // pricing clean
      product.pricing = pricingArr.map((p) => ({
        unit: p.unit,
        value: Number(p.value) || 0,
        price: Number(p.price),
      }));

      // 🔥 discount calculation

      if (finalPrice > 0 && finalPrice < basePrice) {
        product.discount = Number(
          (((basePrice - finalPrice) / basePrice) * 100).toFixed(2),
        );
        product.discountedPrice = finalPrice;
      } else {
        product.discount = 0;
        product.discountedPrice = null;
      }
    }

    /* ================= FEATURES ================= */
    if (features) {
      product.features =
        typeof features === "string" ? JSON.parse(features) : features;
    }

    /* ================= NEW FIELDS ================= */
    product.trustedQuality =
      trustedQuality !== undefined
        ? trustedQuality === "true" || trustedQuality === true
        : product.trustedQuality;

    product.deliveryTime = deliveryTime ?? product.deliveryTime ?? "24 hours";
    product.returnPolicy =
      returnPolicy ?? product.returnPolicy ?? "Return Assured";

    product.sourcedFreshDaily =
      sourcedFreshDaily !== undefined
        ? sourcedFreshDaily === "true" || sourcedFreshDaily === true
        : product.sourcedFreshDaily;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // 1️⃣ Delete product
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // 2️⃣ Delete product images
    if (deletedProduct.productImage?.length) {
      deletedProduct.productImage.forEach((img) => {
        const imgPath = path.join(__dirname, "..", img);
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
      });
    }

    // 3️⃣ Remove product from all wishlists
    await Wishlist.updateMany({}, { $pull: { products: { productId } } });

    // 4️⃣ Remove product from carts
    const carts = await Cart.find({ "items.productId": productId });

    for (let cart of carts) {
      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId,
      );

      // 🔁 Recalculate totals
      cart.totalAmount = cart.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      cart.payableAmount =
        cart.totalAmount + cart.deliveryCharges - cart.coinsUsed;

      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product deleted and removed from cart & wishlist",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controllers/suggestionController.js
module.exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    // Case-insensitive search in productName or description
    const products = await Product.find({
      $or: [
        { productName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
      // ❌ Exclude low margin products
      $or: [{ isLowMargin: { $exists: false } }, { isLowMargin: false }],
    })
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName")
      .limit(50) // optional limit
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Search Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// @desc    Get all products
// @route   GET /api/products
module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName")
      .populate("spicialDiscount")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports.getSomeProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      // ❌ LOW MARGIN PRODUCTS EXCLUDE
      {
        $match: {
          $or: [
            { isLowMargin: { $exists: false } }, // old products
            { isLowMargin: false },
          ],
        },
      },

      // 🎯 Random 20 products
      { $sample: { size: 20 } },

      // -------- Category Lookup --------
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },

      // -------- SubCategory Lookup --------
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategoryId",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $unwind: {
          path: "$subCategory",
          preserveNullAndEmptyArrays: true,
        },
      },

      // -------- Offer Lookup --------
      {
        $lookup: {
          from: "offers",
          localField: "spicialDiscount",
          foreignField: "_id",
          as: "spicialDiscount",
        },
      },
      {
        $unwind: {
          path: "$spicialDiscount",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName")
      .populate("spicialDiscount");

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get product price based on unit
// @route   POST /api/products/:id/price
module.exports.getPriceByUnit = async (req, res) => {
  try {
    const { unit, value } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const pricingOption = product.pricing.find((p) => p.unit === unit);
    if (!pricingOption) {
      return res.status(400).json({
        success: false,
        message: `No pricing available for unit: ${unit}`,
      });
    }

    const val = Number(value) || 1;
    const totalPrice = pricingOption.price * val;

    res.status(200).json({
      success: true,
      data: {
        productId: product._id,
        unit: pricingOption.unit,
        value: val,
        pricePerUnit: pricingOption.price,
        totalPrice,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/getProductsBySubCategory/:subCategoryId
module.exports.getProductsBySubCategory = async (req, res) => {
  try {
    const { subCategoryId } = req.params;

    // Find all products with this subCategoryId
    const products = await Product.find({ subCategoryId });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.getSuggestedProducts = async (req, res) => {
  try {
    const { id: userId } = req.user;

    // ✅ Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // 1️⃣ Get recent orders of user
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select("items");

    if (!recentOrders.length) {
      return res.status(200).json({
        message: "No past orders found for user",
        suggestedProducts: [],
      });
    }

    // 2️⃣ Collect unique ordered productIds
    const orderedProductIdsSet = new Set();
    recentOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.productId) {
          orderedProductIdsSet.add(item.productId.toString());
        }
      });
    });

    // 3️⃣ Fetch ordered products to get category/subcategory
    const orderedProducts = await Product.find({
      _id: {
        $in: Array.from(orderedProductIdsSet).map(
          (id) => new mongoose.Types.ObjectId(id),
        ),
      },
    }).select("categoryId subCategoryId");

    if (!orderedProducts.length) {
      return res.status(200).json({
        message: "No products found for user's past orders",
        suggestedProducts: [],
      });
    }

    // 4️⃣ Collect unique categoryIds & subCategoryIds
    const categoryIdsSet = new Set();
    const subCategoryIdsSet = new Set();

    orderedProducts.forEach((p) => {
      if (p.categoryId) categoryIdsSet.add(p.categoryId.toString());
      if (p.subCategoryId) subCategoryIdsSet.add(p.subCategoryId.toString());
    });

    // ✅ Convert to ObjectId arrays (CRITICAL FIX)
    const categoryIds = Array.from(categoryIdsSet).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const subCategoryIds = Array.from(subCategoryIdsSet).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const orderedProductIds = Array.from(orderedProductIdsSet).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    // 5️⃣ Find suggested products
    const suggestedProducts = await Product.find({
      $and: [
        {
          $or: [
            { categoryId: { $in: categoryIds } },
            { subCategoryId: { $in: subCategoryIds } },
          ],
        },
        { _id: { $nin: orderedProductIds } },

        // ❌ EXCLUDE LOW MARGIN PRODUCTS
        {
          $or: [{ isLowMargin: { $exists: false } }, { isLowMargin: false }],
        },
      ],
    })
      .limit(20)
      .populate("categoryId subCategoryId spicialDiscount");

    console.log(suggestedProducts);
    return res.status(200).json({
      message: "Suggested products based on past orders",
      suggestedProducts,
    });
  } catch (error) {
    console.error("Error in getSuggestedProducts:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
// ---------------------------------------------
// @desc    Get products by multiple subCategoryIds
// @route   POST /api/products/getProductsBySubCategories
// ---------------------------------------------
module.exports.getProductsBySubCategories = async (req, res) => {
  try {
    const { subCategoryIds } = req.body;

    // ✅ Validation
    if (!Array.isArray(subCategoryIds) || subCategoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "subCategoryIds must be a non-empty array",
      });
    }

    // ✅ Convert to ObjectId safely
    const validSubCategoryIds = subCategoryIds
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    if (validSubCategoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid subCategoryIds provided",
      });
    }

    // ✅ Fetch products
    const products = await Product.find({
      subCategoryId: { $in: validSubCategoryIds },
    })
      .populate("categoryId", "categoryName")
      .populate("subCategoryId", "subCategoryName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("getProductsBySubCategories error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const LOW_STOCK_LIMIT = 10;

const updateProductStatus = async () => {
  try {
    // OUT OF STOCK
    await Product.updateMany(
      { stock: { $eq: 0 } },
      { $set: { status: "Out Of Stock" } },
    );

    // LOW STOCK
    await Product.updateMany(
      { stock: { $gt: 0, $lte: LOW_STOCK_LIMIT } },
      { $set: { status: "Low Stock" } },
    );

    // IN STOCK
    await Product.updateMany(
      { stock: { $gt: LOW_STOCK_LIMIT } },
      { $set: { status: "In Stock" } },
    );

    console.log("✅ Product status updated (3-level stock)");
  } catch (error) {
    console.error("❌ Product status cron error:", error);
  }
};

// every 3 hours
cron.schedule("0 */3 * * *", updateProductStatus);
