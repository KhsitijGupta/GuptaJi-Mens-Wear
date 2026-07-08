const Offer = require("../models/Offer.js");
const Product = require("../models/Product.js");
const { uploadFile } = require("../services/cloudinaryService");

const removeOfferFromProducts = async (offer) => {
  if (!offer || !offer._id) return;

  const result = await Product.updateMany(
    { spicialDiscount: offer._id }, // 🔥 ONLY this condition
    {
      $set: {
        spicialDiscount: null,
        SpecialDiscountedPrice: "",
      },
    },
  );

  console.log("Products updated:", result.modifiedCount);
};

// Function to generate next offerId
const generateOfferId = async () => {
  const lastOffer = await Offer.findOne().sort({ createdAt: -1 });

  // If no offer exists, start with mmOF-001
  if (!lastOffer || !lastOffer.offerId) return "ZKOFF-001";

  // Safely extract number
  const parts = lastOffer.offerId.split("-");
  const lastNumber = parseInt(parts[1]) || 0;
  const nextNumber = lastNumber + 1;

  return `ZkOFF-${nextNumber.toString().padStart(3, "0")}`;
};

// ------------------------------------
// Create Offer
// ------------------------------------
module.exports.createOffer = async (req, res) => {
  try {
    const { offerId, offerTitle, offerPercentage } = req.body;
    console.log(req.body);
    if (!offerTitle || offerPercentage === undefined) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
    // Multer image upload handling
    let offerImage = null;
    if (req.file) {
      const uploadResult = await uploadFile(req.file, "offers");
      offerImage = uploadResult.secure_url;
    }

    const existing = await Offer.findOne({ offerId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Offer with this offerId already exists",
      });
    }

    const offer = await Offer.create({
      offerId: await generateOfferId(),
      offerTitle,
      offerImage,
      offerPercentage,
    });

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------------------------
// Get All Offers
// ------------------------------------
module.exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: offers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------------------------
// Get Single Offer by offerId
// ------------------------------------
module.exports.getOfferById = async (req, res) => {
  try {
    const { id: offerId } = req.params;

    const offer = await Offer.findOne({ offerId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------------------------
// Update Offer
// ------------------------------------
module.exports.updateOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    console.log(offerId);

    const updatedOffer = await Offer.findByIdAndUpdate(
      { _id: offerId },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    console.log(updatedOffer);

    if (!updatedOffer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------------------------
// Change Offer Status (active / inactive)
// ------------------------------------
module.exports.toggleOfferStatus = async (req, res) => {
  try {
    const { _id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const offer = await Offer.findOneAndUpdate(
      { _id },
      { status },
      { new: true },
    );

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // 🔥 If offer inactive → remove from products
    if (status === "inactive") {
      await removeOfferFromProducts(offer);
      offer.products = [];
      await offer.save();
    }

    res.status(200).json({
      success: true,
      message: "Offer status updated",
      data: offer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ------------------------------------
// Delete Offer
// ------------------------------------

module.exports.deleteOffer = async (req, res) => {
  try {
    const { offerId } = req.params;

    const offer = await Offer.findOne({ _id: offerId });
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // 🔥 Remove offer from all linked products
    await removeOfferFromProducts(offer);

    await Offer.deleteOne({ _id: offer._id });

    res.status(200).json({
      success: true,
      message: "Offer deleted and removed from products successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ------------------------------------
// Apply Offer on Products
// ------------------------------------
module.exports.applyOfferToProducts = async (req, res) => {
  try {
    const { offerId, productIds } = req.body;

    if (!offerId || !productIds || !productIds.length) {
      return res.status(400).json({
        success: false,
        message: "Offer ID and Product IDs are required",
      });
    }

    // 1. Find Offer
    const offer = await Offer.findOne({ offerId });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // 2. Fetch products
    const products = await Product.find({ _id: { $in: productIds } });

    if (!products.length) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    // 3. Prepare bulk updates
    const bulkOps = products.map((product) => {
      // Base price: lowest price from pricing array
      const basePrice = Math.min(...product.pricing.map((p) => p.price));

      const discountAmount = (basePrice * offer.offerPercentage) / 100;

      const SpecialDiscountedPrice = Math.round(basePrice - discountAmount);

      return {
        updateOne: {
          filter: { _id: product._id },
          update: {
            $set: {
              spicialDiscount: offer._id,
              SpecialDiscountedPrice,
            },
          },
        },
      };
    });

    // 4. Apply bulk update
    await Product.bulkWrite(bulkOps);

    // 5. Update offer product list (avoid duplicates)
    await Offer.findByIdAndUpdate(offer._id, {
      $addToSet: { products: { $each: productIds } },
    });

    return res.status(200).json({
      success: true,
      message: "Offer applied successfully with discounted price",
    });
  } catch (error) {
    console.error("Apply Offer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// module.module.exports.updateOffer = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { offerPercentage } = req.body;

//     const offer = await Offer.findById(id).populate("products");

//     if (!offer) {
//       return res.status(404).json({
//         success: false,
//         message: "Offer not found",
//       });
//     }

//     // 1️⃣ Update offer itself
//     offer.offerPercentage = offerPercentage;
//     await offer.save();

//     // 2️⃣ Recalculate discounted price for all linked products
//     const bulkOps = offer.products.map((product) => {
//       const basePrice = product.pricing?.[0]?.price || 0;

//       const discountedPrice =
//         basePrice > 0
//           ? Math.round(basePrice - (basePrice * offerPercentage) / 100)
//           : null;

//       return {
//         updateOne: {
//           filter: { _id: product._id },
//           update: {
//             $set: {
//               discount: offerPercentage,
//               discountedPrice,
//             },
//           },
//         },
//       };
//     });

//     if (bulkOps.length) {
//       await Product.bulkWrite(bulkOps);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Offer updated & prices recalculated",
//     });
//   } catch (error) {
//     console.error("Update Offer Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };
