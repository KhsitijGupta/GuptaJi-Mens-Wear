const express = require("express");
const router = express.Router();

const {
  downloadInvoicePDFController,
} = require("../controllers/invoiceController");

const { authenticateUser, authorizeRoles } = require("../middleware/auth");

router.get("/preview/:id", downloadInvoicePDFController);

module.exports = router;
