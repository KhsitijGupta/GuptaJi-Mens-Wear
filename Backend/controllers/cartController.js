
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const coinRule = require("../models/coinRule");

// --------------------------------------------------
// 🔁 CALCULATE COINS USAGE (AUTO, RULE-BASED)
// --------------------------------------------------
async function calculateCoinsUsageFromCart(cartAmount, userCoins) {
  const rules = await coinRule
    .find({ isActive: true })
    .sort({ price: -1 })
    .lean();

  let remainingAmount = cartAmount;
  let remainingCoins = userCoins;
  let coinsUsed = 0;

  for (const rule of rules) {
    if (remainingAmount < rule.price || remainingCoins <= 0) continue;

    const slabCount = Math.floor(remainingAmount / rule.price);
    const possibleCoins = slabCount * rule.coins;
    const usableCoins = Math.min(possibleCoins, remainingCoins);

    coinsUsed += usableCoins;
    remainingCoins -= usableCoins;
    remainingAmount -= Math.floor(usableCoins / rule.coins) * rule.price;
  }

  return coinsUsed;
}

// --------------------------------------------------
// 🔁 RECALCULATE CART (COMMON)
// --------------------------------------------------
async function recalculateCart(cart) {
  const user = await User.findById(cart.userId).lean();

  // Coins apply on DISCOUNTED TOTAL
  const coinsUsed = await calculateCoinsUsageFromCart(
    cart.payableAmount,
    user.coins,
  );

  cart.coinsApplicable = coinsUsed;
  cart.coinsUsed = coinsUsed;
  cart.payableAmount = Math.max(cart.payableAmount - coinsUsed, 0);
}

// --------------------------------------------------
// ➕ ADD TO CART
// --------------------------------------------------

module.exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    /* ---------------- PRODUCT & STOCK CHECK ---------------- */
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: "Product is out of stock" });
    }

    /* ---------------- CART FETCH ---------------- */
    let cart = await Cart.findOne({ userId });

    // existing quantity in cart
    let existingQty = 0;
    if (cart) {
      const existingItem = cart.items.find(
        (i) => i.productId.toString() === productId,
      );
      if (existingItem) {
        existingQty = existingItem.quantity;
      }
    }

    // 🔥 FINAL STOCK VALIDATION
    if (existingQty + quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock - existingQty} item(s) left in stock`,
      });
    }

    /* ---------------- PRICING ---------------- */
    const originalPrice = Number(product.pricing?.[0]?.price || 0);
    const discountedPrice = Number(
      product.SpecialDiscountedPrice ||
        product.discountedPrice ||
        originalPrice,
    );

    const image = product.productImage?.[0] || "";

    /* ---------------- CREATE / UPDATE CART ---------------- */
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            name: product.productName,
            price: discountedPrice,
            quantity,
            image,
            totalPrice: originalPrice * quantity,
          },
        ],
      });
    } else {
      const index = cart.items.findIndex(
        (i) => i.productId.toString() === productId,
      );

      if (index > -1) {
        cart.items[index].quantity += quantity;
        cart.items[index].totalPrice =
          originalPrice * cart.items[index].quantity;
      } else {
        cart.items.push({
          productId,
          name: product.productName,
          price: discountedPrice,
          quantity,
          image,
          totalPrice: originalPrice * quantity,
        });
      }
    }

    /* ---------------- TOTALS ---------------- */
    // MRP total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Discounted total
    cart.payableAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    /* ---------------- DELIVERY CHARGES ---------------- */
    // yaha tum condition laga rahe ho:
    // agar payableAmount > 250 && payableAmount < 500 => delivery 25
    if (cart.payableAmount > 250 && cart.payableAmount < 500) {
      cart.deliveryCharges = 25;
    } else {
      cart.deliveryCharges = 0;
    }

    // agar tum deliveryCharges ko payableAmount me include karna chahte ho:
    cart.payableAmount = cart.payableAmount + cart.deliveryCharges;

    /* ---------------- COINS / OTHER CALC ---------------- */
    await recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// 📦 GET USER CART
// --------------------------------------------------

module.exports.getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    /* ---------------- VALIDATION ---------------- */
    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    /* ---------------- FETCH CART ---------------- */
    const cart = await Cart.findOne({ userId })
      .populate({
        path: "items.productId",
        select: "productName pricing productImage stock",
      })
      .lean();

    if (!cart) {
      return res.status(200).json({
        message: "Cart is empty",
        cart: null,
      });
    }

    /* ---------------- HANDLE DELETED PRODUCTS ---------------- */
    const validItems = cart.items.filter((item) => item.productId !== null);

    if (validItems.length !== cart.items.length) {
      // update cart if some products were deleted
      cart.items = validItems;

      cart.totalAmount = validItems.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      const discountedSubtotal = validItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      cart.deliveryCharges =
        discountedSubtotal > 250 && discountedSubtotal < 500 ? 25 : 0;

      cart.payableAmount = discountedSubtotal + cart.deliveryCharges;

      await Cart.findByIdAndUpdate(cart._id, cart);
    }

    /* ---------------- EMPTY CART AFTER CLEANUP ---------------- */
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        message: "Cart is empty",
        cart: null,
      });
    }

    /* ---------------- SUCCESS ---------------- */
    res.status(200).json({
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      message: "Error fetching cart",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// ✏️ UPDATE CART ITEM
// --------------------------------------------------
module.exports.updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId,
    );
    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const originalPrice = Number(product.pricing?.[0]?.price || 0);

    // Update item
    cart.items[index].quantity = quantity;
    cart.items[index].totalPrice = originalPrice * quantity;

    // Stock check (optional - prevent negative stock)
    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available in stock`,
      });
    }

    /* ---------------- TOTALS ---------------- */
    // MRP total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Discounted subtotal (without delivery)
    const discountedSubtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    /* ---------------- DELIVERY CHARGES ---------------- */
    // Same logic as addToCart
    if (discountedSubtotal > 250 && discountedSubtotal < 500) {
      cart.deliveryCharges = 25;
    } else {
      cart.deliveryCharges = 0;
    }

    // Final payable amount = subtotal + delivery
    cart.payableAmount = discountedSubtotal + cart.deliveryCharges;

    /* ---------------- COINS / OTHER CALC ---------------- */
    await recalculateCart(cart);
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// ❌ REMOVE CART ITEM
// --------------------------------------------------
module.exports.removeCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Check if item exists before removing
    const existingItemIndex = cart.items.findIndex(
      (i) => i.productId.toString() === productId,
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Remove item
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);

    /* ---------------- TOTALS ---------------- */
    // MRP total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Discounted subtotal (without delivery)
    const discountedSubtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    /* ---------------- DELIVERY CHARGES ---------------- */
    // Same logic: 250 < subtotal < 500 = 25rs delivery
    if (discountedSubtotal > 250 && discountedSubtotal < 500) {
      cart.deliveryCharges = 25;
    } else {
      cart.deliveryCharges = 0;
    }

    // Final payable amount = subtotal + delivery
    cart.payableAmount = discountedSubtotal + cart.deliveryCharges;

    /* ---------------- COINS / OTHER CALC ---------------- */
    await recalculateCart(cart);
    await cart.save();

    // If cart is empty, you might want to delete it entirely
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        message: "Item removed and cart emptied (deleted)",
        cart: null,
      });
    }

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({ message: error.message });
  }
};

// --------------------------------------------------
// 🔍 GET SINGLE CART ITEM
// --------------------------------------------------
module.exports.getCartItemById = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId._id.toString() === productId,
    );

    if (!item)
      return res.status(404).json({ message: "Item not found in cart" });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching cart item",
      error: error.message,
    });
  }
};

// --------------------------------------------------
// ➖ DECREASE CART ITEM QUANTITY BY 1
// --------------------------------------------------
module.exports.decreaseCartItemQuantity = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id: userId } = req.user;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "userId and productId are required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const index = cart.items.findIndex(
      (i) => i.productId.toString() === productId,
    );

    if (index === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const originalPrice = Number(product.pricing?.[0]?.price || 0);

    /* ---------------- DECREASE QTY ---------------- */
    cart.items[index].quantity -= 1;

    // ❌ Quantity zero → remove product
    if (cart.items[index].quantity <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].totalPrice = originalPrice * cart.items[index].quantity;
    }

    // 🧹 Cart empty → delete cart
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return res.status(200).json({
        message: "Cart emptied",
        cart: null,
      });
    }

    /* ---------------- TOTALS ---------------- */

    // MRP total
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Discounted subtotal
    const discountedSubtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    /* ---------------- DELIVERY ---------------- */
    if (discountedSubtotal > 250 && discountedSubtotal < 500) {
      cart.deliveryCharges = 25;
    } else {
      cart.deliveryCharges = 0;
    }

    cart.payableAmount = discountedSubtotal + cart.deliveryCharges;

    /* ---------------- COINS ---------------- */
    await recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      message: "Item quantity decreased",
      cart,
    });
  } catch (error) {
    console.error("Decrease cart item error:", error);
    res.status(500).json({ message: error.message });
  }
};
