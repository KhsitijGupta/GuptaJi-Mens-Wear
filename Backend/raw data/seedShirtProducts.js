const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const Product = require("../models/Product");

const seedShirtProducts = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://kg221688_db_user:rS7vtMKIKQuUPF81@cluster0.kgkq6sp.mongodb.net/t",
    );

    console.log("✅ MongoDB Connected");

    const category = await Category.findOne({
      categoryName: "Shirt",
    });

    if (!category) {
      console.log("❌ Shirt category not found");
      process.exit();
    }

    const subCategories = await SubCategory.find({
      categoryId: category._id,
    });

    if (!subCategories.length) {
      console.log("❌ No Shirt subcategories found");
      process.exit();
    }

    // Delete old products (Optional)
    await Product.deleteMany({
      categoryId: category._id,
    });

    console.log("🗑 Old Shirt Products Deleted");

    // Last Product Id
    const lastProduct = await Product.findOne().sort({ createdAt: -1 });

    let lastNumber = 0;

    if (lastProduct?.productId) {
      lastNumber = parseInt(lastProduct.productId.replace("GMWPRO", ""), 10);
    }

    // ======================== CHECKED SHIRTS ========================
    // ======================== PRINTED SHIRTS ========================

    const printedShirts = [
      {
        productName: "Floral Printed Shirt",
        tags: ["shirt", "printed", "floral", "men"],
        features: ["100% Cotton", "Soft Fabric", "Breathable"],
      },
      {
        productName: "Abstract Printed Shirt",
        tags: ["shirt", "printed", "abstract", "men"],
        features: ["Premium Cotton", "Regular Fit", "Machine Wash"],
      },
      {
        productName: "Tropical Printed Shirt",
        tags: ["shirt", "printed", "tropical", "summer"],
        features: ["Lightweight", "Comfort Fit", "Soft Cotton"],
      },
      {
        productName: "Paisley Printed Shirt",
        tags: ["shirt", "printed", "paisley", "fashion"],
        features: ["Wrinkle Resistant", "Premium Fabric", "Slim Fit"],
      },
      {
        productName: "Leaf Printed Shirt",
        tags: ["shirt", "printed", "leaf", "casual"],
        features: ["100% Cotton", "Breathable", "Long Lasting"],
      },
      {
        productName: "Graphic Printed Shirt",
        tags: ["shirt", "printed", "graphic", "streetwear"],
        features: ["Comfort Fit", "Machine Wash", "Soft Fabric"],
      },
      {
        productName: "Ethnic Printed Shirt",
        tags: ["shirt", "printed", "ethnic", "designer"],
        features: ["Premium Cotton", "Regular Fit", "Easy Care"],
      },
    ];

    const printedSubCategory = await SubCategory.findOne({
      subCategoryName: "Printed Shirts",
    });

    for (const item of printedShirts) {
      lastNumber++;

      const price = Math.floor(Math.random() * 1200) + 999;
      const discount = Math.floor(Math.random() * 30);
      const discountedPrice = Math.round(price - (price * discount) / 100);

      const product = await Product.create({
        productName: item.productName,
        productId: `GMWPRO${String(lastNumber).padStart(4, "0")}`,

        description:
          "Premium printed shirt crafted from breathable cotton with stylish prints for everyday and party wear.",

        productImage: ["/uploads/product/1782904164743-Trousers.webp"],

        pricing: [
          {
            unit: "Piece",
            value: 1,
            price,
          },
        ],

        stock: Math.floor(Math.random() * 80) + 20,

        discount,
        discountedPrice,

        categoryId: category._id,
        subCategoryId: printedSubCategory._id,

        features: item.features,
        tags: item.tags,

        trustedQuality: true,
        deliveryTime: "24 hours",
        returnPolicy: "Return Assured",
        sourcedFreshDaily: false,
        isLowMargin: false,
      });

      await SubCategory.findByIdAndUpdate(printedSubCategory._id, {
        $push: {
          products: product._id,
        },
      });

      console.log(`✅ ${product.productName} Created`);
    }
    // ======================== LINEN SHIRTS ========================

    const linenShirts = [
      {
        productName: "White Linen Shirt",
        tags: ["shirt", "linen", "white", "men"],
        features: ["100% Linen", "Breathable", "Lightweight"],
      },
      {
        productName: "Beige Linen Shirt",
        tags: ["shirt", "linen", "beige", "casual"],
        features: ["Premium Linen", "Comfort Fit", "Soft Fabric"],
      },
      {
        productName: "Olive Linen Shirt",
        tags: ["shirt", "linen", "olive", "summer"],
        features: ["Natural Linen", "Regular Fit", "Breathable"],
      },
      {
        productName: "Blue Linen Shirt",
        tags: ["shirt", "linen", "blue", "men"],
        features: ["100% Linen", "Wrinkle Resistant", "Soft Finish"],
      },
      {
        productName: "Grey Linen Shirt",
        tags: ["shirt", "linen", "grey", "casual"],
        features: ["Premium Linen", "Machine Wash", "Comfort Fit"],
      },
      {
        productName: "Black Linen Shirt",
        tags: ["shirt", "linen", "black", "fashion"],
        features: ["Luxury Linen", "Breathable", "Slim Fit"],
      },
      {
        productName: "Cream Linen Shirt",
        tags: ["shirt", "linen", "cream", "premium"],
        features: ["Natural Linen", "Soft Fabric", "Long Lasting"],
      },
    ];

    const linenSubCategory = await SubCategory.findOne({
      subCategoryName: "Linen Shirts",
    });

    for (const item of linenShirts) {
      lastNumber++;

      const price = Math.floor(Math.random() * 1200) + 1099;
      const discount = Math.floor(Math.random() * 30);
      const discountedPrice = Math.round(price - (price * discount) / 100);

      const product = await Product.create({
        productName: item.productName,
        productId: `GMWPRO${String(lastNumber).padStart(4, "0")}`,

        description:
          "Premium linen shirt crafted from high-quality natural linen fabric for exceptional comfort, breathability, and a sophisticated everyday look.",

        productImage: ["/uploads/product/1782904164743-Trousers.webp"],

        pricing: [
          {
            unit: "Piece",
            value: 1,
            price,
          },
        ],

        stock: Math.floor(Math.random() * 80) + 20,

        discount,
        discountedPrice,

        categoryId: category._id,
        subCategoryId: linenSubCategory._id,

        features: item.features,
        tags: item.tags,

        trustedQuality: true,
        deliveryTime: "24 hours",
        returnPolicy: "Return Assured",
        sourcedFreshDaily: false,
        isLowMargin: false,
      });

      await SubCategory.findByIdAndUpdate(linenSubCategory._id, {
        $push: {
          products: product._id,
        },
      });

      console.log(`✅ ${product.productName} Created`);
    }
    // ======================== CHECKED SHIRTS ========================

    const checkedShirts = [
      {
        productName: "Blue Checked Shirt",
        tags: ["shirt", "checked", "blue", "men"],
        features: ["100% Cotton", "Regular Fit", "Breathable"],
      },
      {
        productName: "Red Checked Shirt",
        tags: ["shirt", "checked", "red", "men"],
        features: ["Premium Cotton", "Comfort Fit", "Machine Wash"],
      },
      {
        productName: "Green Checked Shirt",
        tags: ["shirt", "checked", "green", "men"],
        features: ["Soft Fabric", "Slim Fit", "Easy Care"],
      },
      {
        productName: "Black Checked Shirt",
        tags: ["shirt", "checked", "black", "men"],
        features: ["Wrinkle Resistant", "Premium Fabric", "Long Lasting"],
      },
      {
        productName: "Navy Checked Shirt",
        tags: ["shirt", "checked", "navy", "men"],
        features: ["100% Cotton", "Breathable", "Regular Fit"],
      },
      {
        productName: "Grey Checked Shirt",
        tags: ["shirt", "checked", "grey", "men"],
        features: ["Comfort Fit", "Machine Wash", "Soft Cotton"],
      },
      {
        productName: "Brown Checked Shirt",
        tags: ["shirt", "checked", "brown", "men"],
        features: ["Premium Cotton", "Slim Fit", "Durable Fabric"],
      },
    ];

    const checkedSubCategory = await SubCategory.findOne({
      subCategoryName: "Checked Shirts",
    });

    for (const item of checkedShirts) {
      lastNumber++;

      const price = Math.floor(Math.random() * 1200) + 999;
      const discount = Math.floor(Math.random() * 30);
      const discountedPrice = Math.round(price - (price * discount) / 100);

      const product = await Product.create({
        productName: item.productName,
        productId: `GMWPRO${String(lastNumber).padStart(4, "0")}`,

        description:
          "Premium checked shirt designed with stylish patterns and breathable cotton fabric for all-day comfort.",

        productImage: ["/uploads/product/1782904164743-Trousers.webp"],

        pricing: [
          {
            unit: "Piece",
            value: 1,
            price,
          },
        ],

        stock: Math.floor(Math.random() * 80) + 20,

        discount,
        discountedPrice,

        categoryId: category._id,
        subCategoryId: checkedSubCategory._id,

        features: item.features,
        tags: item.tags,

        trustedQuality: true,
        deliveryTime: "24 hours",
        returnPolicy: "Return Assured",
        sourcedFreshDaily: false,
        isLowMargin: false,
      });

      await SubCategory.findByIdAndUpdate(checkedSubCategory._id, {
        $push: {
          products: product._id,
        },
      });

      console.log(`✅ ${product.productName} Created`);
    }
    // ======================== FORMAL SHIRTS ========================

    const formalShirts = [
      {
        productName: "White Formal Shirt",
        tags: ["shirt", "formal", "white", "office"],
        features: ["100% Cotton", "Slim Fit", "Wrinkle Resistant"],
      },
      {
        productName: "Sky Blue Formal Shirt",
        tags: ["shirt", "formal", "sky blue", "office"],
        features: ["Premium Cotton", "Breathable", "Machine Wash"],
      },
      {
        productName: "Black Formal Shirt",
        tags: ["shirt", "formal", "black", "executive"],
        features: ["Regular Fit", "Soft Fabric", "Long Lasting"],
      },
      {
        productName: "Grey Office Shirt",
        tags: ["shirt", "formal", "grey", "office"],
        features: ["Comfort Fit", "Wrinkle Free", "Premium Fabric"],
      },
      {
        productName: "Navy Formal Shirt",
        tags: ["shirt", "formal", "navy", "business"],
        features: ["100% Cotton", "Breathable", "Regular Fit"],
      },
      {
        productName: "Light Pink Formal Shirt",
        tags: ["shirt", "formal", "pink", "office"],
        features: ["Premium Cotton", "Soft Fabric", "Easy Care"],
      },
      {
        productName: "Executive White Shirt",
        tags: ["shirt", "executive", "white", "formal"],
        features: ["Luxury Cotton", "Slim Fit", "Machine Wash"],
      },
    ];

    const formalSubCategory = await SubCategory.findOne({
      subCategoryName: "Formal Shirts",
    });

    for (const item of formalShirts) {
      lastNumber++;

      const price = Math.floor(Math.random() * 1200) + 999;
      const discount = Math.floor(Math.random() * 30);
      const discountedPrice = Math.round(price - (price * discount) / 100);

      const product = await Product.create({
        productName: item.productName,
        productId: `GMWPRO${String(lastNumber).padStart(4, "0")}`,

        description:
          "Premium formal shirt crafted for office wear with superior comfort and elegant style.",

        productImage: ["/uploads/product/1782904164743-Trousers.webp"],

        pricing: [
          {
            unit: "Piece",
            value: 1,
            price,
          },
        ],

        stock: Math.floor(Math.random() * 80) + 20,

        discount,
        discountedPrice,

        categoryId: category._id,
        subCategoryId: formalSubCategory._id,

        features: item.features,
        tags: item.tags,

        trustedQuality: true,
        deliveryTime: "24 hours",
        returnPolicy: "Return Assured",
        sourcedFreshDaily: false,
        isLowMargin: false,
      });

      await SubCategory.findByIdAndUpdate(formalSubCategory._id, {
        $push: {
          products: product._id,
        },
      });

      console.log(`✅ ${product.productName} Created`);
    }
    const casualShirts = [
      {
        productName: "Blue Casual Shirt",
        tags: ["shirt", "casual", "blue", "men"],
        features: ["100% Cotton", "Breathable", "Regular Fit"],
      },
      {
        productName: "Black Casual Shirt",
        tags: ["shirt", "casual", "black", "men"],
        features: ["Soft Fabric", "Comfort Fit", "Machine Wash"],
      },
      {
        productName: "White Casual Shirt",
        tags: ["shirt", "casual", "white", "men"],
        features: ["Premium Cotton", "Lightweight", "Wrinkle Resistant"],
      },
      {
        productName: "Olive Casual Shirt",
        tags: ["shirt", "casual", "olive", "men"],
        features: ["Slim Fit", "Breathable", "Soft Cotton"],
      },
      {
        productName: "Beige Casual Shirt",
        tags: ["shirt", "casual", "beige", "men"],
        features: ["Premium Fabric", "Easy Care", "Comfort Fit"],
      },
      {
        productName: "Grey Casual Shirt",
        tags: ["shirt", "casual", "grey", "men"],
        features: ["Stretchable", "Regular Fit", "Machine Wash"],
      },
      {
        productName: "Maroon Casual Shirt",
        tags: ["shirt", "casual", "maroon", "men"],
        features: ["Premium Cotton", "Breathable", "Long Lasting"],
      },
    ];
    const casualSubCategory = await SubCategory.findOne({
      subCategoryName: "Casual Shirts",
    });

    for (const item of casualShirts) {
      lastNumber++;

      const price = Math.floor(Math.random() * 1200) + 799;
      const discount = Math.floor(Math.random() * 35);
      const discountedPrice = Math.round(price - (price * discount) / 100);

      const product = await Product.create({
        productName: item.productName,
        productId: `GMWPRO${String(lastNumber).padStart(4, "0")}`,

        description:
          "Premium quality casual shirt made from breathable cotton fabric for everyday comfort.",

                productImage: ["/uploads/product/1782904164743-Trousers.webp"],


        pricing: [
          {
            unit: "Piece",
            value: 1,
            price,
          },
        ],

        stock: Math.floor(Math.random() * 80) + 20,

        discount,
        discountedPrice,

        categoryId: category._id,
        subCategoryId: casualSubCategory._id,

        features: item.features,
        tags: item.tags,

        trustedQuality: true,
        deliveryTime: "24 hours",
        returnPolicy: "Return Assured",
        sourcedFreshDaily: false,
        isLowMargin: false,
      });

      await SubCategory.findByIdAndUpdate(casualSubCategory._id, {
        $push: {
          products: product._id,
        },
      });

      console.log(`✅ ${product.productName} Created`);
    }

    console.log("\n🎉 Shirt Products Seeded Successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedShirtProducts();
