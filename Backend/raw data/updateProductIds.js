const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

const updateProductIds = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t",
    );
    console.log("✅ MongoDB Connected");

    // Sort by createdAt so order consistent rahe
    const products = await Product.find().sort({ createdAt: 1 });

    let counter = 1;

    for (let product of products) {
      const newProductId = `ZKPRO${String(counter).padStart(4, "0")}`;

      product.productId = newProductId;
      await product.save();

      console.log(`Updated: ${product._id} → ${newProductId}`);

      counter++;
    }

    console.log("🎉 All productIds updated successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error updating productIds:", error);
    process.exit(1);
  }
};

updateProductIds();
