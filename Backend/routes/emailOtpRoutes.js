const express = require("express");
const { sendOtp, verifyUserOtp, verifyDeliveryPersonOtp } = require("../controllers/emailOtpController");
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp/user", verifyUserOtp);
router.post("/verify-otp/deliveryPerson", verifyDeliveryPersonOtp);

module.exports = router;