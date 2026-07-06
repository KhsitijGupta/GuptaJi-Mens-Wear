const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    coId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      default: null,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      default: null,
    },
    coinsEarned: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay", "Stripe", "PayPal"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Out Of Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
    /* 🔥 COD TRACKING */
    codCollected: {
      type: Boolean,
      default: false,
    },

    codCollectedAt: {
      type: Date,
      default: null,
    },
    deliveryCharges: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, required: true },
    payableAmount: { type: Number, required: true },
    transactionId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    coinsUsed: {
      type: Number,
      required: true,
    },
    orderPin: {
      type: Number,
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
        price: Number,
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
