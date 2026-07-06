const mongoose = require("mongoose");

const deliveryTransactionSchema = new mongoose.Schema(
  {
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "COD_COLLECTED",
        "ADMIN_SETTLEMENT",
        "WALLET_CREDIT",
        "WALLET_DEBIT",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },

    referenceNo: {
      type: String,
      default: null,
    },

    note: String,

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

deliveryTransactionSchema.index({ deliveryPerson: 1, createdAt: -1 });

module.exports = mongoose.model(
  "DeliveryTransaction",
  deliveryTransactionSchema
);
