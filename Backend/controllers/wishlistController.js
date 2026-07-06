const Wishlist = require("../models/wishlist");
const Product = require("../models/Product");






// ✅ Toggle product in Wishlist
module.exports.toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // create wishlist with product
      wishlist = await Wishlist.create({ userId, products: [{ productId }] });
      return res.status(200).json({ message: "Product added to wishlist", wishlist });
    }

    const index = wishlist.products.findIndex(p => p.productId.toString() === productId);

    if (index > -1) {
      // product exists → remove it
      wishlist.products.splice(index, 1);
      await wishlist.save();
      return res.status(200).json({ message: "Product removed from wishlist", wishlist });
    } else {
      // product not in wishlist → add it
      wishlist.products.push({ productId });
      await wishlist.save();
      return res.status(200).json({ message: "Product added to wishlist", wishlist });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get wishlist for a user
module.exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId }).populate("products.productId");
    if (!wishlist) return res.status(200).json({ products: [] });
    res.status(200).json({ products: wishlist.products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
