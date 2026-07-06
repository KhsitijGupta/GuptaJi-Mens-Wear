const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productId: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    productImage: {
      type: [String], // multiple images
      default: [],
    },
    pricing: [
      {
        unit: {
          type: String,
          // enum: ["kg", "g", "ml", "l", "piece", "pack"],
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        value: {
          type: Number, // quantity per unit
          default: 0,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: null,
    },
    spicialDiscount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Offer",
      default: null,
    },
    discountedPrice: {
      type: Number,
      default: null,
    },
    SpecialDiscountedPrice: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "In Stock", "Low Stock", "Out Of Stock"],
      default: "active",
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    validity: {
      type: Date,
      required: false,
    },
    features: {
      type: [String], // e.g., Organic, Fresh, Non-GMO
      default: [],
    },
    tags: {
      type: [String], // for search keywords
      default: null,
    },
    weight: {
      type: Number,
      default: null, // in grams
    },
    dimensions: {
      length: { type: Number, default: null },
      width: { type: Number, default: null },
      height: { type: Number, default: null },
    },
    // ✅ New fields
    trustedQuality: {
      type: Boolean,
      default: true,
    },
    deliveryTime: {
      type: String,
      default: "24 hours",
    },
    returnPolicy: {
      type: String,
      enum: ["Return Assured", "No Return"],
      default: "Return Assumed",
    },
    sourcedFreshDaily: {
      type: Boolean,
      default: false,
    },
    isLowMargin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
