const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

module.exports.getDashboardStats = async (req, res) => {
  try {
    // Total Orders
    const totalOrders = await Order.countDocuments();

    // Pending Orders
    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Products
    const totalProducts = await Product.countDocuments();

    // Total Revenue (Completed Orders)
    const revenueAgg = await Order.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$payableAmount" },
        },
      },
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        totalUsers,
        totalProducts,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
