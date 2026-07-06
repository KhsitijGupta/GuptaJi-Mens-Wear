    const express = require("express");
    const router = express.Router();

    const {
    createCoinRule,
    getAllCoinRules,
    getCoinsByAmount,
    updateCoinRule,
    deleteCoinRule,
    } = require("../controllers/coinRuleController.js");
    const { authenticateUser, authorizeRoles } = require("../middleware/auth.js");

    // Admin routes
    router.post(
    "/create",
    authenticateUser,
    authorizeRoles("admin"),
    createCoinRule
    );
    router.get("/all", authenticateUser, authorizeRoles("admin"), getAllCoinRules);
    router.put(
    "/update/:id",
    authenticateUser,
    authorizeRoles("admin"),
    updateCoinRule
    );
    router.delete(
    "/delete/:id",
    authenticateUser,
    authorizeRoles("admin"),
    deleteCoinRule
    );

    // Public/User route
    router.get(
    "/calculate",
    authenticateUser,
    authorizeRoles("admin"),
    getCoinsByAmount
    );

    module.exports = router;
