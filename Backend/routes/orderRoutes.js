const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyRazorpayPayment,
  getOrderById,
  getUserOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  getMonthlyOrders,
  getOrdersByDeliveryPerson,
  getStockFlowProducts,
  getWeeklyOrders,
  getWeeklyOrdersByDay,
} = require("../controllers/orderController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.post(
  "/createOrder",
  authenticateUser,
  authorizeRoles("user", "admin"),
  createOrder,
);
router.post(
  "/verifyRazorpayPayment",
  authenticateUser,
  authorizeRoles("user", "admin"),
  verifyRazorpayPayment,
);
router.get(
  "/getAllOrders",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getAllOrders,
);
router.get(
  "/getOrdersByDeliveryPerson/:deliveryPersonId",
  authenticateUser,
  authorizeRoles("delivery_person", "admin"),
  getOrdersByDeliveryPerson,
);
router.get(
  "/getOrderById/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getOrderById,
);
// router.get("/getUserOrderId/:userId", authenticateUser, authorizeRoles("user", "admin"), getUserOrderId);
router.get(
  "/getUserOrder",
  authenticateUser,
  authorizeRoles("user"),
  getUserOrder,
);
router.put(
  "/updateOrderStatus/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  updateOrderStatus,
);
router.delete(
  "/cancelOrder/:id",
  authenticateUser,
  authorizeRoles("user", "admin"),
  cancelOrder,
);
router.get("/monthlyOrders", getMonthlyOrders); // ✅ Add this route
router.get(
  "/monthlyrevenue",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getMonthlyOrders,
);
router.get(
  "/getWeeklyOrders",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getWeeklyOrders,
);
router.get(
  "/getWeeklyOrdersByDay",
  authenticateUser,
  authorizeRoles("user", "admin"),
  getWeeklyOrdersByDay,
);
router.get(
  "/ProductStockFlow",
  authenticateUser,
  authorizeRoles("admin"),
  getStockFlowProducts,
);
// routes/orders.js

module.exports = router;
