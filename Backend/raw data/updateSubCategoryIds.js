const mongoose = require("mongoose");
const SubCategory = require("../models/SubCategory");
require("dotenv").config();

const updateSubCategoryIds = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t",
    );
    console.log("✅ MongoDB Connected");

    // Consistent order
    const subCategories = await SubCategory.find().sort({ createdAt: 1 });

    let counter = 1;

    for (let sub of subCategories) {
      const newId = `ZKSCAT${String(counter).padStart(4, "0")}`;

      sub.subCategoryId = newId;
      await sub.save();

      console.log(`Updated: ${sub._id} → ${newId}`);
      counter++;
    }

    console.log("🎉 All subCategoryIds updated successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

updateSubCategoryIds();
