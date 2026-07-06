const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const seedShirtSubCategories = async () => {
  try {
    // MongoDB Connection
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t"
    );

    console.log("✅ MongoDB Connected");

    // Find Shirt Category
    const shirtCategory = await Category.findOne({
      categoryName: "Shirt",
    });

    if (!shirtCategory) {
      console.log("❌ Category 'Shirt' not found.");
      process.exit(1);
    }

    // Delete old Shirt subcategories
    await SubCategory.deleteMany({
      categoryId: shirtCategory._id,
    });

    console.log("🗑 Old Shirt SubCategories Deleted");

    // Reset category subcategories
    shirtCategory.subCategories = [];
    await shirtCategory.save();

    // Get last SubCategoryId
    const lastSubCategory = await SubCategory.findOne().sort({
      createdAt: -1,
    });

    let lastNumber = 0;

    if (lastSubCategory?.subCategoryId) {
      lastNumber = parseInt(
        lastSubCategory.subCategoryId.replace("GMWsCat", ""),
        10
      );
    }

    // Only 7 Shirt Subcategories
    const subCategoryNames = [
      "Casual Shirts",
      "Formal Shirts",
      "Checked Shirts",
      "Printed Shirts",
      "Linen Shirts",
      "Denim Shirts",
      "Polo Shirts",
    ];

    const subCategoryIds = [];

    for (const name of subCategoryNames) {
      lastNumber++;

      const subCategory = await SubCategory.create({
        subCategoryName: name,
        subCategoryId: `GMWsCat${String(lastNumber).padStart(4, "0")}`,
        image: `/uploads/Subcategory/1782904164743-Trousers.webp`,
        categoryId: shirtCategory._id,
        products: [],
      });

      subCategoryIds.push(subCategory._id);

      console.log(`✅ ${name} Created`);
    }

    // Update Category
    shirtCategory.subCategories = subCategoryIds;
    await shirtCategory.save();

    console.log("");
    console.log("🎉========================================🎉");
    console.log("✅ Shirt SubCategories Seeded Successfully");
    console.log(`📦 Total SubCategories : ${subCategoryIds.length}`);
    console.log("🎉========================================🎉");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seedShirtSubCategories();