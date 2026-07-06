const express = require("express");
const router = express.Router();

const {
  CompleteOrder,
  adminSettlement,
  walletCredit,
  walletDebit,
  deliveryDashboard,
  getTransactionsByDeliveryPerson,
  getTransactionsByDeliveryPersonForAdmin,
} = require("../controllers/deliveryAccountingController.js");

// 🔐 Middlewares (assumed existing)
const { authenticateUser, authorizeRoles } = require("../middleware/auth.js");

/* =========================================================
   DELIVERY PERSON ROUTES
   ========================================================= */

// Delivery complete + COD collect
router.post(
  "/CompleteOrder/:orderId",
  authenticateUser,
  authorizeRoles("delivery_person"),
  CompleteOrder
);

// Delivery person dashboard
router.get(
  "/dashboard/:deliveryPersonId",
  authenticateUser,
  authorizeRoles("delivery_person", "admin"),
  deliveryDashboard
);

/* =========================================================
   ADMIN ROUTES
   ========================================================= */

// Admin settlement (cash receive)
router.post(
  "/admin-settlement",
  authenticateUser,
  authorizeRoles("admin"),
  adminSettlement
);

// Wallet credit (commission / incentive)
router.post(
  "/wallet-credit",
  authenticateUser,
  authorizeRoles("admin"),
  walletCredit
);

// Wallet debit (penalty)
router.post(
  "/wallet-debit",
  authenticateUser,
  authorizeRoles("admin"),
  walletDebit
);

router.get(
  "/transactions",
  authenticateUser,
  authorizeRoles("delivery_person"),
  getTransactionsByDeliveryPerson
);
router.get(
  "/transactionsForAdmin/:id",
  authenticateUser,
  authorizeRoles("admin"),
  getTransactionsByDeliveryPersonForAdmin
);

module.exports = router;
