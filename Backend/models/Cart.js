// const mongoose = require("mongoose");

// const cartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   quantity: { typ  e: Number, default: 1 },
//   image: { type: String },
//   totalPrice: {
//     type: Number,
//     required: true,
//   },
// });

// const cartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     items: [cartItemSchema],
//     totalAmount: {
//       type: Number,
//       required: true,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Cart", cartSchema);
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  image: { type: String },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [cartItemSchema],

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveryCharges: {
      type: Number,
      required: true,
      default: 0,
    },

    // 🔥 COIN SYSTEM (AUTO)
    coinsApplicable: {
      type: Number,
      default: 0, // calculated from rules + user wallet
    },

    coinsUsed: {
      type: Number,
      default: 0,
    },

    payableAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
