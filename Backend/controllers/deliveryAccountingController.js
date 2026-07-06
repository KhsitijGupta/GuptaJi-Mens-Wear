const mongoose = require("mongoose");
const DeliveryPerson = require("../models/DeliveryPerson");
const Order = require("../models/Order");
const DeliveryTransaction = require("../models/DeliveryTransaction");
const DeliverySettlement = require("../models/DeliverySettlement");

/* =========================================================
   1️⃣ COD COLLECT (Delivery Complete)
   ========================================================= */


module.exports.CompleteOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.params;
    const { orderPin } = req.body;

    if (!orderPin) {
      throw new Error("Order PIN is required");
    }

    /* ---------------- FIND ORDER ---------------- */
    const order = await Order.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");

    if (order.codCollected) {
      throw new Error("COD already collected");
    }

    /* ---------------- PIN CHECK ---------------- */
    if (String(order.orderPin) !== String(orderPin)) {
      throw new Error("Invalid Order PIN");
    }

    /* ---------------- FIND DELIVERY PERSON ---------------- */
    const deliveryPerson = await DeliveryPerson.findById(
      order.deliveryPerson
    ).session(session);

    if (!deliveryPerson) {
      throw new Error("Delivery person not found");
    }

    /* ---------------- UPDATE ORDER ---------------- */
    order.codCollected = true;
    order.codCollectedAt = new Date();
    order.orderStatus = "Delivered";
    await order.save({ session });

    /* ---------------- UPDATE DP ASSIGNED ORDERS ---------------- */
    const assignedOrder = deliveryPerson.assignedOrders.find(
      (o) => o.orderId.toString() === order._id.toString()
    );

    if (!assignedOrder) {
      throw new Error("Order not assigned to this delivery person");
    }

    assignedOrder.status = "Delivered";

    /* ---------------- UPDATE DP CASH & AVAILABILITY ---------------- */
    deliveryPerson.cashInHand += order.payableAmount;
    deliveryPerson.availabilityStatus = "Available";

    await deliveryPerson.save({ session });

    /* ---------------- LEDGER ENTRY ---------------- */
    await DeliveryTransaction.create(
      [
        {
          deliveryPerson: deliveryPerson._id,
          type: "COD_COLLECTED",
          amount: order.payableAmount,
          order: order._id,
          note: "COD collected after PIN verification",
        },
      ],
      { session }
    );

    /* ---------------- COMMIT ---------------- */
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Order delivered successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================================================
   2️⃣ ADMIN SETTLEMENT (Cash Given to Admin)
   ========================================================= */
module.exports.adminSettlement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { deliveryPersonId, amount, mode, remark } = req.body;

    const dp = await DeliveryPerson.findById(deliveryPersonId).session(session);
    if (!dp) throw new Error("Delivery person not found");

    if (dp.cashInHand < amount) throw new Error("Insufficient cash in hand");

    // Update cash
    dp.cashInHand -= amount;
    dp.lastSettlementAt = new Date();
    await dp.save({ session });

    // Settlement record
    await DeliverySettlement.create(
      [
        {
          deliveryPerson: dp._id,
          amountReceived: amount,
          settlementMode: mode,
          remark,
        },
      ],
      { session }
    );

    // Ledger
    await DeliveryTransaction.create(
      [
        {
          deliveryPerson: dp._id,
          type: "ADMIN_SETTLEMENT",
          amount,
          note: "Cash settled to admin",
          createdBy: req.user?._id || null,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Settlement successful" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: err.message });
  }
};

/* =========================================================
   3️⃣ WALLET CREDIT (Commission / Incentive)
   ========================================================= */
module.exports.walletCredit = async (req, res) => {
  const { deliveryPersonId, amount, note } = req.body;

  const dp = await DeliveryPerson.findById(deliveryPersonId);
  if (!dp) return res.status(404).json({ message: "Not found" });

  dp.walletBalance += amount;
  await dp.save();

  await DeliveryTransaction.create({
    deliveryPerson: dp._id,
    type: "WALLET_CREDIT",
    amount,
    note,
    createdBy: req.user?._id || null,
  });

  res.json({ success: true, message: "Wallet credited" });
};

/* =========================================================
   4️⃣ WALLET DEBIT (Penalty / Adjustment)
   ========================================================= */
module.exports.walletDebit = async (req, res) => {
  const { deliveryPersonId, amount, note } = req.body;

  const dp = await DeliveryPerson.findById(deliveryPersonId);
  if (!dp) return res.status(404).json({ message: "Not found" });

  if (dp.walletBalance < amount)
    return res.status(400).json({ message: "Insufficient wallet balance" });

  dp.walletBalance -= amount;
  await dp.save();

  await DeliveryTransaction.create({
    deliveryPerson: dp._id,
    type: "WALLET_DEBIT",
    amount,
    note,
    createdBy: req.user?._id || null,
  });

  res.json({ success: true, message: "Wallet debited" });
};

/* =========================================================
   5️⃣ DELIVERY PERSON DASHBOARD SUMMARY
   ========================================================= */
module.exports.deliveryDashboard = async (req, res) => {
  const { deliveryPersonId } = req.params;

  const transactions = await DeliveryTransaction.find({
    deliveryPerson: deliveryPersonId,
  });

  let totalCOD = 0;
  let totalSettlement = 0;

  transactions.forEach((t) => {
    if (t.type === "COD_COLLECTED") totalCOD += t.amount;
    if (t.type === "ADMIN_SETTLEMENT") totalSettlement += t.amount;
  });

  const dp = await DeliveryPerson.findById(deliveryPersonId);

  res.json({
    totalCODCollected: totalCOD,
    givenToAdmin: totalSettlement,
    pendingToAdmin: totalCOD - totalSettlement,
    cashInHand: dp.cashInHand,
    walletBalance: dp.walletBalance,
  });
};
/* =========================================================
   6️⃣ GET ALL TRANSACTIONS FOR DP
   ========================================================= */
module.exports.getTransactionsByDeliveryPerson = async (req, res) => {
  try {
    const { id: deliveryPersonId } = req.user;

    // optional query params
    const {
      type, // COD_COLLECTED | ADMIN_SETTLEMENT | WALLET_CREDIT | WALLET_DEBIT
      startDate, // YYYY-MM-DD
      endDate, // YYYY-MM-DD
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(deliveryPersonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery person id",
      });
    }

    const filter = {
      deliveryPerson: deliveryPersonId,
    };

    /* ---------- TYPE FILTER ---------- */
    if (type) {
      filter.type = type;
    }

    /* ---------- DATE FILTER ---------- */
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      DeliveryTransaction.find(filter)
        .populate("order", "coId payableAmount orderStatus")
        .sort({ createdAt: -1 }),

      DeliveryTransaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        totalRecords: total,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
/* =========================================================
   6️⃣ GET ALL TRANSACTIONS FOR ADMIN
   ========================================================= */
module.exports.getTransactionsByDeliveryPersonForAdmin = async (req, res) => {
  try {
    const { id: deliveryPersonId } = req.params;

    // optional query params
    const {
      type, // COD_COLLECTED | ADMIN_SETTLEMENT | WALLET_CREDIT | WALLET_DEBIT
      startDate, // YYYY-MM-DD
      endDate, // YYYY-MM-DD
      page = 1,
      limit = 10,
    } = req.query;

    if (!mongoose.Types.ObjectId.isValid(deliveryPersonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery person id",
      });
    }

    const filter = {
      deliveryPerson: deliveryPersonId,
    };

    /* ---------- TYPE FILTER ---------- */
    if (type) {
      filter.type = type;
    }

    /* ---------- DATE FILTER ---------- */
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      DeliveryTransaction.find(filter)
        .populate("order", "coId payableAmount orderStatus")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      DeliveryTransaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        totalRecords: total,
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
