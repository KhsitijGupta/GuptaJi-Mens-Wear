const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { authenticateUser, authorizeRoles } = require("../middleware/auth");

// Create a new wallet transaction
router.post("/createWalletTransaction", authenticateUser,authorizeRoles("user","admin"), walletController.createWalletTransaction);

// Get all wallet transactions for a user
router.get("/getUserWallet/:userId", authenticateUser,authorizeRoles("user","admin"), walletController.getUserWallet);

// Get a single wallet transaction by ID
router.get("/getWalletTransaction/:id", authenticateUser,authorizeRoles("user","admin"), walletController.getWalletTransaction);

// Update a wallet transaction
router.put("/updateWalletTransaction/:id", authenticateUser,authorizeRoles("user","admin"), walletController.updateWalletTransaction);

// Delete a wallet transaction
router.delete("/deleteWalletTransaction/:id", authenticateUser,authorizeRoles("user","admin"), walletController.deleteWalletTransaction);

module.exports = router;
