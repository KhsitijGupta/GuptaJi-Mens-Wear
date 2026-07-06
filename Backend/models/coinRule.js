const mongoose = require("mongoose");

const coinRuleSchema = new mongoose.Schema({
  price: {
    type: Number, // eg: 1000, 500, 250
    required: true,
  },
  coins: {
    type: Number, // eg: 25, 12, 6
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("CoinRule", coinRuleSchema);
