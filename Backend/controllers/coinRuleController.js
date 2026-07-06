const CoinRule = require("../models/coinRule.js");

/* =====================================================
   CREATE COIN RULE (Admin)
   Example:
   price: 1000
   coins: 25
===================================================== */
module.exports.createCoinRule = async (req, res, next) => {
  try {
    const { price, coins } = req.body;

    if (!price || !coins) {
      return res.status(400).json({
        success: false,
        message: "price and coins are required",
      });
    }

    const rule = await CoinRule.create({
      price,
      coins,
    });

    res.status(201).json({
      success: true,
      message: "Coin rule created successfully",
      data: rule,
    });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   GET ALL COIN RULES (Admin)
===================================================== */
module.exports.getAllCoinRules = async (req, res, next) => {
  try {
    const rules = await CoinRule.find().sort({ price: -1 });

    res.status(200).json({
      success: true,
      data: rules,
    });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DYNAMIC GREEDY COIN CALCULATION
   Same logic as your hardcoded version
===================================================== */
module.exports.getCoinsByAmount = async (req, res, next) => {
  try {
    const { amount } = req.query;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid amount is required",
      });
    }

    const coinTable = await CoinRule.find({ isActive: true })
      .sort({ price: -1 })
      .lean();

    let remaining = Number(amount);
    let totalCoins = 0;

    for (const tier of coinTable) {
      const count = Math.floor(remaining / tier.price);

      if (count > 0) {
        totalCoins += count * tier.coins;
        remaining -= count * tier.price;
      }
    }

    res.status(200).json({
      success: true,
      coins: totalCoins,
    });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   UPDATE COIN RULE (Admin)
===================================================== */
module.exports.updateCoinRule = async (req, res, next) => {
  try {
    const rule = await CoinRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rule updated successfully",
      data: rule,
    });
  } catch (err) {
    next(err);
  }
};

/* =====================================================
   DELETE COIN RULE (Admin)
===================================================== */
module.exports.deleteCoinRule = async (req, res, next) => {
  try {
    const rule = await CoinRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rule deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
