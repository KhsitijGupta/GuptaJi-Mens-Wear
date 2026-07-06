const mongoose = require("mongoose");
const Category = require("../models/Category");
require("dotenv").config();

const updateCategoryIds = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t",
    );
    console.log("✅ MongoDB Connected");

    // Order maintain karne ke liye
    const categories = await Category.find().sort({ createdAt: 1 });

    let counter = 1;

    for (let category of categories) {
      const newCategoryId = `ZKCAT${String(counter).padStart(4, "0")}`;

      category.categoryId = newCategoryId;
      await category.save();

      console.log(`Updated: ${category._id} → ${newCategoryId}`);
      counter++;
    }

    console.log("🎉 All categoryIds updated successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error updating categoryIds:", error);
    process.exit(1);
  }
};

updateCategoryIds();
