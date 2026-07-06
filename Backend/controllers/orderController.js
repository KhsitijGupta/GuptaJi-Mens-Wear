const mongoose = require("mongoose");
const crypto = require("crypto");
const Razorpay = require("razorpay");
const Wallet = require("../models/Wallet");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { sendNotification } = require("../services/firebaseService");
const nodemailer = require("nodemailer");
const fireModel = require("../models/fireModel");
const Notification = require("../models/notificationModel");
const coinRule = require("../models/coinRule");
const Address = require("../models/Address");
const { emailHTMLGenerator } = require("../utils/emailHTMLGenerator");

require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* --------------------------------------------
  Generate Order ID
  -------------------------------------------- */
async function generateCoId() {
  const lastOrder = await Order.findOne().sort({ createdAt: -1 }).lean();
  if (!lastOrder?.coId) return "ZKODA0001";

  const prefix = lastOrder.coId.slice(0, 5);
  const series = lastOrder.coId.charAt(5);
  const number = parseInt(lastOrder.coId.slice(6)) + 1;

  if (number <= 9999) {
    return `${prefix}${series}${String(number).padStart(4, "0")}`;
  }
  return `${prefix}${String.fromCharCode(series.charCodeAt(0) + 1)}0001`;
}
/* -------------------------------------------- Calculate Coins -------------------------------------------- */
async function calculateCoinsDynamic(amount) {
  const rules = await coinRule.find({ isActive: true }).sort({ price: -1 });
  let remaining = Number(amount);
  let coins = 0;
  for (const rule of rules) {
    const count = Math.floor(remaining / rule.price);
    coins += count * rule.coins;
    remaining -= count * rule.price;
  }
  return coins;
}
/* -------------------------------------------- Mail Setup -------------------------------------------- */ const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
  });
const sendMail = (from, to, subject, html) =>
  transporter.sendMail({
    from: `"Order System" <${process.env.GMAIL_USER}>`,
    to,
    cc: from, // 👈 from email CC me
    subject,
    html,
  });
function generate4DigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}
/* --------------------------------------------
      CREATE ORDER
      -------------------------------------------- */

module.exports.createOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { paymentMethod, shippingAddress, useCoins = false } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    const address = await Address.findOne({ _id: shippingAddress, userId });
    if (!address) {
      return res.status(403).json({ message: "Invalid shipping address" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${item.name} is out of stock or insufficient quantity`,
        });
      }
    }

    const deliveryCharges = Number(cart.deliveryCharges || 0);
    const subtotalAmount = cart.payableAmount - deliveryCharges;
    const totalAmount = Number(cart.totalAmount);

    let payableAmount = Number(cart.payableAmount);
    const coinsUsed = useCoins ? Number(cart.coinsUsed || 0) : 0;
    const earnedCoins = await calculateCoinsDynamic(payableAmount);
    const discount =
      totalAmount - subtotalAmount - deliveryCharges - coinsUsed > 0
        ? totalAmount - subtotalAmount - deliveryCharges - coinsUsed
        : 0;

    const newCoId = await generateCoId();
    payableAmount = useCoins ? payableAmount - coinsUsed : payableAmount;

    if (paymentMethod === "Razorpay") {
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        return res.status(500).json({
          message:
            "Razorpay credentials are not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        });
      }

      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(payableAmount * 100),
        currency: "INR",
        receipt: newCoId,
        payment_capture: 1,
        notes: {
          userId,
          shippingAddress,
        },
      });

      return res.status(201).json({
        message: "Razorpay payment initiated. Complete Razorpay payment.",
        razorpayKey: process.env.RAZORPAY_KEY_ID,
        razorpayOrder,
        coId: newCoId,
        payableAmount,
      });
    }

    const order = await Order.create({
      coId: newCoId,
      userId,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      deliveryCharges,
      totalAmount,
      payableAmount,
      discount,
      coinsUsed,
      coinsEarned: earnedCoins,
      items: cart.items.map(({ productId, quantity, price, name, image }) => ({
        productId,
        quantity,
        price,
        name,
        image,
      })),
      orderPin: generate4DigitNumber(),
    });

    const transactionPayload = {
      userId,
      orderId: order._id,
      paymentMethod,
      paymentStatus: "Pending",
      amount: payableAmount,
      currency: "INR",
      transactionType: "Order",
      notes: "COD order created, payment pending on delivery",
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { coins: earnedCoins - coinsUsed } },
      { new: true },
    );

    await Wallet.create({
      userId,
      orderId: order._id,
      amountSpent: payableAmount,
      coinsEarned: earnedCoins,
      coinsUsed,
      balanceCoins: updatedUser.coins,
      transactionType: "Order",
    });

    await Transaction.create(transactionPayload);

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    await Cart.findByIdAndDelete(cart._id);

    res.status(201).json({
      message: "Order placed successfully",
      order,
      walletBalance: updatedUser.coins,
    });

    setImmediate(async () => {
      try {
        const fire = await fireModel
          .findOne({ userId })
          .sort({ createdAt: -1 })
          .lean();

        if (fire?.fcmToken) {
          const title = "Order Placed Successfully";
          const body = `Order ${newCoId} placed. Payable ₹${payableAmount}`;
          console.log(fire.fcmToken);
          await Notification.create({ userId, title, body });
          await sendNotification(fire.fcmToken, title, body);
        }

        await sendMail(
          [updatedUser.email, "kg221688@gmail.com"],
          "kg221688@gmail.com",
          `New Order - ${newCoId}`,
          emailHTMLGenerator(cart, updatedUser, address, order),
        );
      } catch (err) {
        console.error("Post order async error:", err);
      }
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      orderId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      shippingAddress,
      useCoins = false,
    } = req.body;
    const { id: userId } = req.user;

    if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      return res.status(400).json({
        message:
          "Missing required payment verification fields: razorpayPaymentId, razorpayOrderId, razorpaySignature",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      await Transaction.create({
        userId,
        orderId: orderId || null,
        paymentMethod: "Razorpay",
        paymentStatus: "Failed",
        amount: 0,
        currency: "INR",
        transactionType: "Order",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        notes: "Razorpay signature verification failed",
      });
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    let order = null;
    let transaction = null;
    let updatedUser;

    if (orderId) {
      order = await Order.findById(orderId);
      if (order && order.paymentStatus === "Paid") {
        return res.status(400).json({ message: "Order is already paid" });
      }
      if (order && order.paymentMethod !== "Razorpay") {
        return res
          .status(400)
          .json({ message: "Order is not configured for Razorpay payment" });
      }
    }

    if (!order) {
      if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required" });
      }

      const address = await Address.findOne({ _id: shippingAddress, userId });
      if (!address) {
        return res.status(403).json({ message: "Invalid shipping address" });
      }

      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product not found: ${item.name}` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `${item.name} is out of stock or insufficient quantity`,
          });
        }
      }

      const deliveryCharges = Number(cart.deliveryCharges || 0);
      const totalAmount = Number(cart.totalAmount);
      let payableAmount = Number(cart.payableAmount);
      const coinsUsed = useCoins ? Number(cart.coinsUsed || 0) : 0;
      const earnedCoins = await calculateCoinsDynamic(payableAmount);
      const discount =
        totalAmount - (payableAmount - coinsUsed) - deliveryCharges > 0
          ? totalAmount - (payableAmount - coinsUsed) - deliveryCharges
          : 0;

      const newCoId = await generateCoId();
      payableAmount = useCoins ? payableAmount - coinsUsed : payableAmount;

      order = await Order.create({
        coId: newCoId,
        userId,
        shippingAddress,
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
        orderStatus: "Processing",
        deliveryCharges,
        totalAmount,
        payableAmount,
        discount,
        coinsUsed,
        coinsEarned,
        transactionId: razorpayPaymentId,
        razorpayOrderId,
        items: cart.items.map(({ productId, quantity, price, name, image }) => ({
          productId,
          quantity,
          price,
          name,
          image,
        })),
        orderPin: generate4DigitNumber(),
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: earnedCoins - coinsUsed } },
        { new: true },
      );

      await Wallet.create({
        userId,
        orderId: order._id,
        amountSpent: payableAmount,
        coinsEarned,
        coinsUsed,
        balanceCoins: updatedUser.coins,
        transactionType: "Order",
      });

      transaction = await Transaction.create({
        userId,
        orderId: order._id,
        paymentMethod: "Razorpay",
        paymentStatus: "Paid",
        amount: payableAmount,
        currency: "INR",
        transactionType: "Order",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        notes: "Razorpay payment verified and order created",
      });

      for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      await Cart.findByIdAndDelete(cart._id);

      setImmediate(async () => {
        try {
          const fire = await fireModel
            .findOne({ userId })
            .sort({ createdAt: -1 })
            .lean();

          if (fire?.fcmToken) {
            const title = "Payment Received";
            const body = `Payment received for order ${order.coId}. Thank you!`;
            await Notification.create({ userId, title, body });
            await sendNotification(fire.fcmToken, title, body);
          }

          await sendMail(
            [updatedUser.email, "kg221688@gmail.com"],
            "kg221688@gmail.com",
            `Payment Completed - ${order.coId}`,
            emailHTMLGenerator(order, updatedUser, address, order),
          );
        } catch (err) {
          console.error("Post payment async error:", err);
        }
      });
    } else {
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      order.transactionId = razorpayPaymentId;
      order.razorpayOrderId = razorpayOrderId;
      await order.save();

      transaction = await Transaction.findOneAndUpdate(
        { orderId: order._id, paymentMethod: "Razorpay", razorpayOrderId },
        {
          paymentStatus: "Paid",
          razorpayPaymentId,
          razorpaySignature,
          notes: "Razorpay payment verified successfully",
        },
        { new: true, upsert: true },
      );

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: order.coinsEarned - order.coinsUsed } },
        { new: true },
      );

      await Wallet.create({
        userId,
        orderId: order._id,
        amountSpent: order.payableAmount,
        coinsEarned: order.coinsEarned,
        coinsUsed: order.coinsUsed,
        balanceCoins: updatedUser.coins,
        transactionType: "Order",
      });

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      await Cart.findOneAndDelete({ userId });

      const address = await Address.findById(order.shippingAddress);

      setImmediate(async () => {
        try {
          const fire = await fireModel
            .findOne({ userId })
            .sort({ createdAt: -1 })
            .lean();

          if (fire?.fcmToken) {
            const title = "Payment Received";
            const body = `Payment received for order ${order.coId}. Thank you!`;
            await Notification.create({ userId, title, body });
            await sendNotification(fire.fcmToken, title, body);
          }

          await sendMail(
            [updatedUser.email, "kg221688@gmail.com"],
            "kg221688@gmail.com",
            `Payment Completed - ${order.coId}`,
            emailHTMLGenerator(order, updatedUser, address, order),
          );
        } catch (err) {
          console.error("Post payment async error:", err);
        }
      });
    }

    res.status(200).json({
      message: "Payment verified and order confirmed.",
      order,
      transaction,
      walletBalance: updatedUser?.coins,
    });
  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* --------------------------------------------
      CANCEL ORDER (FULL ROLLBACK)
      -------------------------------------------- */
module.exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    // Rollback coins
    await User.findByIdAndUpdate(order.userId, {
      $inc: {
        coins: order.coinsUsed - order.coinsEarned,
      },
    });

    await Wallet.create({
      userId: order.userId,
      orderId: order._id,
      amountSpent: order.payableAmount,
      coinsEarned: -order.coinsEarned,
      coinsUsed: -order.coinsUsed,
      transactionType: "Cancel",
    });

    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// ------------------------------------------------
// Other functions (unchanged)
// ------------------------------------------------

module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId")
      .populate("deliveryPerson")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId")
      .populate("items.productId")
      .populate("deliveryPerson")
      .populate("shippingAddress");
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
};

module.exports.getUserOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate("items.productId")
      .populate("userId")
      .populate("deliveryPerson")
      .populate("shippingAddress")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user orders", error: error.message });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const updateFields = { ...req.body };

    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    })
      .populate("userId")
      .populate("items.productId")
      .populate("deliveryPerson");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};

module.exports.getAllDeliveryPerson = async (req, res) => {
  try {
    const deliveryPersons = await User.find({ role: "deliveryPerson" }).select(
      "_id fullName email phone isActive createdAt",
    );

    res.status(200).json({ success: true, deliveryPersons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports.getDeliveryPersonById = async (req, res) => {
  try {
    const deliveryPerson = await User.findOne({
      _id: req.params.id,
      role: "deliveryPerson",
    }).select("_id fullName email phone isActive createdAt");

    if (!deliveryPerson)
      return res.status(404).json({ message: "Delivery person not found" });

    res.status(200).json({ success: true, deliveryPerson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.getMonthlyOrders = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    // Generate all 12 months template
    const monthsTemplate = Array.from({ length: 12 }, (_, i) => ({
      year: currentYear,
      monthNum: i + 1,
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
    }));

    // Get real monthly data
    const realData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      {
        $match: { "_id.year": currentYear }, // Current year only
      },
      {
        $project: {
          year: "$_id.year",
          monthNum: "$_id.month",
          orders: 1,
        },
      },
    ]);

    // Merge: Fill missing months with 0
    const monthlyData = monthsTemplate.map((template) => {
      const realMonth = realData.find(
        (r) => r.year === template.year && r.monthNum === template.monthNum,
      );
      return {
        month: `${template.month}-${template.year}`,
        orders: realMonth ? realMonth.orders : 0,
      };
    });

    console.log("📊 Complete Monthly Data:", monthlyData);
    res.status(200).json({
      success: true,
      data: monthlyData,
    });
  } catch (error) {
    console.error("Monthly Orders Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch monthly orders",
    });
  }
};
module.exports.getWeeklyOrders = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.week": 1,
        },
      },
      {
        $project: {
          _id: 0,
          week: {
            $concat: [
              "Week ",
              { $toString: "$_id.week" },
              " - ",
              { $toString: "$_id.year" },
            ],
          },
          orders: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
module.exports.getWeeklyOrdersByDay = async (req, res) => {
  try {
    const today = new Date();

    // 🔹 start of week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // 🔹 end of week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" }, // 1=Sun ... 7=Sat
          orders: { $sum: 1 },
        },
      },
    ]);

    // 🔹 Prepare all days (important)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const weeklyData = days.map((day) => ({
      day,
      orders: 0,
    }));

    result.forEach((item) => {
      const index = item._id - 1;
      weeklyData[index].orders = item.orders;
    });

    res.status(200).json({
      success: true,
      data: weeklyData,
    });
  } catch (error) {
    console.error("Weekly Orders API Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weekly orders",
    });
  }
};

exports.getOrdersByDeliveryPerson = async (req, res) => {
  try {
    const { deliveryPersonId } = req.params;

    // ✅ validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(deliveryPersonId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery person ID",
      });
    }

    const orders = await Order.find({
      deliveryPerson: deliveryPersonId,
    })
      .populate("userId", "fullName phone email profileImage")
      .populate("shippingAddress")
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Get Orders By Delivery Person Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports.getStockFlowProducts = async (req, res) => {
  try {
    // Optional: last 30 days filter
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const salesData = await Order.aggregate([
      { $unwind: "$items" },

      // Optional date filter
      // { $match: { createdAt: { $gte: fromDate } } },

      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
        },
      },
    ]);

    const salesMap = {};
    salesData.forEach((item) => {
      salesMap[item._id.toString()] = item.totalSold;
    });

    const products = await Product.find();

    const fastFlowing = [];
    const slowFlowing = [];
    const deadStock = [];

    products.forEach((product) => {
      const soldQty = salesMap[product._id.toString()] || 0;

      if (soldQty >= 50) {
        fastFlowing.push({ ...product.toObject(), soldQty });
      } else if (soldQty > 0) {
        slowFlowing.push({ ...product.toObject(), soldQty });
      } else {
        deadStock.push({ ...product.toObject(), soldQty });
      }
    });

    res.status(200).json({
      success: true,
      counts: {
        fastFlowing: fastFlowing.length,
        slowFlowing: slowFlowing.length,
        deadStock: deadStock.length,
      },
      data: {
        fastFlowing,
        slowFlowing,
        deadStock,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch stock flow data",
      error: error.message,
    });
  }
};
