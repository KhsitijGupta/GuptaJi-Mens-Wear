const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
    },
    categoryId: {
      type: String,
      unique: true, // ✅ must be unique
      required: true,
    },
    // description: {
    //   type: String,
    //   required: [true, "Service description is required"],
    // },
    image: {
      type: String,
      required: [true, "Service image URL is required"],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);