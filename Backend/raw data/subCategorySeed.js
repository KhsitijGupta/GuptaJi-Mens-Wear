const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

const seedTrouserSubCategories = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t"
    );

    console.log("✅ MongoDB Connected");

    // Find Trouser Category
    const trouserCategory = await Category.findOne({
      categoryName: "Trousers",
    });

    if (!trouserCategory) {
      console.log("❌ Category 'Trouser' not found.");
      process.exit();
    }

    // Delete existing Trouser subcategories (Optional)
    await SubCategory.deleteMany({
      categoryId: trouserCategory._id,
    });

    console.log("🗑 Old Trouser SubCategories Deleted");

    const subCategoryNames = [
      "Formal Trousers",
      "Casual Trousers",
      "Slim Fit Trousers",
      "Regular Fit Trousers",
      "Relaxed Fit Trousers",
      "Chinos",
      "Cotton Trousers",
      "Linen Trousers",
      "Cargo Trousers",
      "Jogger Trousers",
      "Pleated Trousers",
      "Flat Front Trousers",
      "Stretch Trousers",
      "High Waist Trousers",
      "Low Rise Trousers",
      "Wide Leg Trousers",
      "Straight Fit Trousers",
      "Ankle Length Trousers",
      "Business Trousers",
      "Designer Trousers",
    ];

    // Get last SubCategoryId
    let lastSubCategory = await SubCategory.findOne().sort({
      createdAt: -1,
    });

    let lastNumber = 0;

    if (lastSubCategory?.subCategoryId) {
      lastNumber = parseInt(
        lastSubCategory.subCategoryId.replace("GMWsCat", ""),
        10
      );
    }

    const subCategoryIds = [];

    for (let i = 0; i < subCategoryNames.length; i++) {
      lastNumber++;

      const subCategory = await SubCategory.create({
        subCategoryName: subCategoryNames[i],
        subCategoryId: `GMWsCat${String(lastNumber).padStart(4, "0")}`,
        image: `/uploads/Subcategory/1782903658969-trouser.webp`,
        categoryId: trouserCategory._id,
      });

      subCategoryIds.push(subCategory._id);

      console.log(`✅ ${subCategory.subCategoryName} Created`);
    }

    // Update Category
    trouserCategory.subCategories = subCategoryIds;
    await trouserCategory.save();

    console.log("\n🎉 Trouser SubCategories Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTrouserSubCategories();