const mongoose = require("mongoose"); 

const subCategorySchema = new mongoose.Schema(
  {
    subCategoryName: {
      type: String,
      required: [true, "SubCategory name is required"],
      trim: true,
    },
    subCategoryId: {
      type: String,
      unique: true, // avoid duplicate IDs
    },
    // description: {
    //   type: String,
    //   trim: true,
    // },
    image: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCategory", subCategorySchema);