const mongoose = require("mongoose");

const deliverySettlementSchema = new mongoose.Schema(
  {
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true,
    },

    amountReceived: {
      type: Number,
      required: true,
      min: 0,
    },

    settlementMode: {
      type: String,
      enum: ["CASH", "UPI", "BANK"],
      required: true,
    },

    remark: String,

    settlementDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "DeliverySettlement",
  deliverySettlementSchema
);
