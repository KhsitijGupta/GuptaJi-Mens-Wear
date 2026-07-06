const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amountSpent: {
      type: Number,
      required: true,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    transactionType: {
      type: String,
      enum: ["Order", "Cancel", "Adjustment"], // you can add more if needed
      default: "Order",
    },
    balanceCoins: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wallet", walletSchema);
