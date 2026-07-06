const mongoose = require("mongoose");
const Product = require("../models/Product"); // path adjust karo

const MONGO_URI =
  "mongodb+srv://kg221688_db_user:i2XXpTRjb3Df4pmE@cluster0.qzwittc.mongodb.net/"; // change this

const updateDiscountedPrices = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const products = await Product.find({
      discount: { $gt: 0 },
      pricing: { $exists: true, $ne: [] },
    });

    for (const product of products) {
      const basePrice = product.pricing[0]?.price;

      if (!basePrice) continue;

      const discountPercent = product.discount;
      const discountedPrice = basePrice - (basePrice * discountPercent) / 100;

      product.discountedPrice = Math.round(discountedPrice);

      await product.save();
    }

    console.log(`✅ Updated discountedPrice for ${products.length} products`);
    process.exit();
  } catch (error) {
    console.error("❌ Error updating discounted prices:", error);
    process.exit(1);
  }
};

updateDiscountedPrices();
