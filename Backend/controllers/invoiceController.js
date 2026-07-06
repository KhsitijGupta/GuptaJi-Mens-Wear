const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Order = require("../models/Order");

const BRAND_NAME = "GuptaJi Mens Wear";
const SUB_HEADING = "PREMIUM MEN'S FASHION";

module.exports.downloadInvoicePDFController = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId")
      .populate("items.productId")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ===== INVOICE META =====
    const invoiceNumber = order.coId || order._id.toString().slice(-6);
    const invoiceDate = new Date(order.createdAt).toLocaleDateString("en-GB");
    const shipping = order.shippingAddress || {};

    // ===== THERMAL CONFIG =====
    const PAGE_WIDTH = 268;
    const MARGIN_X = 12; // Balanced margin for elegant spacing
    const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
    const RIGHT_TEXT_WIDTH = PAGE_WIDTH - MARGIN_X - 12;

    // ===== ESTIMATE PAGE HEIGHT =====
    const BASE_HEIGHT = 380; // Adjusted for cleaner professional spacing
    const PER_ITEM_HEIGHT = 50;
    const estimatedHeight = BASE_HEIGHT + order.items.length * PER_ITEM_HEIGHT;

    const doc = new PDFDocument({
      size: [PAGE_WIDTH, estimatedHeight],
      margins: { top: 12, left: 0, right: 0, bottom: 12 },
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoiceNumber}.pdf`,
    );

    doc.pipe(res);

    let y = 14;

    // ===== HELPERS =====
    const drawLine = (thickness = 0.5, isDotted = false) => {
      doc.moveTo(MARGIN_X, y).lineTo(PAGE_WIDTH - MARGIN_X, y);
      if (isDotted) {
        doc.dash(2, { space: 2 });
      } else {
        doc.undash();
      }
      doc.lineWidth(thickness).strokeColor("#102a43").stroke();
      doc.undash(); // Always reset
      y += thickness + 8;
    };

    // ===== HEADER SECTION =====
    // Top Accent Border
    doc.rect(MARGIN_X, y, CONTENT_WIDTH, 3).fill("#102a43");
    y += 12;

    // Logo Image
    const logoPath = path.join(__dirname, "../uploads/logo/image.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, PAGE_WIDTH / 2 - 20, y, { width: 40 });
      y += 45;
    }

    // Brand Titles
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#102a43")
      .text(BRAND_NAME, MARGIN_X, y, { width: CONTENT_WIDTH, align: "center" });
    y += 18;

    doc
      .font("Helvetica")
      .fontSize(7)
      .fillColor("#d4af37") // Premium Gold Text Color Accent
      .text(SUB_HEADING, MARGIN_X, y, {
        width: CONTENT_WIDTH,
        align: "center",
        lineGap: 2,
      });
    y += 14;

    drawLine(1, false);

    // ===== INVOICE & SHIPPING INFO =====
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#102a43")
      .text(`Invoice: #${invoiceNumber}`, MARGIN_X, y);
    y += 14;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#102a43")
      .text("SHIP TO:", MARGIN_X, y);
    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#627d98")
      .text(`Date: ${invoiceDate}`, MARGIN_X, y, {
        width: RIGHT_TEXT_WIDTH,
        align: "right",
      });
    y += 14;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor("#102a43")
      .text(shipping.name || "-", MARGIN_X, y);
    y += 13;

    if (shipping.landmark) {
      doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#486581")
        .text(shipping.landmark, MARGIN_X, y);
      y += 12;
    }

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#486581")
      .text(`${shipping.city || ""} ${shipping.state || ""}`, MARGIN_X, y);
    y += 12;

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor("#486581")
      .text(
        `${shipping.pincode || "-"}  |  ${shipping.phone || "-"}`,
        MARGIN_X,
        y,
      );
    y += 16;

    drawLine(0.5, true);

    // ===== TABLE HEADERS =====
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#102a43");
    doc.text("ITEM DESCRIPTION", MARGIN_X, y, { width: 110 });
    doc.text("QTY", MARGIN_X + 115, y, { width: 25, align: "center" });
    doc.text("RATE", MARGIN_X + 145, y, { width: 40, align: "right" });
    doc.text("AMOUNT", MARGIN_X, y, {
      width: RIGHT_TEXT_WIDTH,
      align: "right",
    });
    y += 14;

    drawLine(0.5, false);

    // ===== ITEMS LINE =====
    const totalAmount = order.totalAmount - order.deliveryCharges;

    order.items.forEach((item, i) => {
      const product = item.productId || {};
      const qty = item.quantity || 1;
      const rate = item.price || 0;
      const amount = qty * rate;

      // Product Title Line
      doc.font("Helvetica-Bold").fontSize(8).fillColor("#102a43");
      doc.text(
        `${i + 1}. ${product.productName?.slice(0, 24) || "Product"}`,
        MARGIN_X,
        y,
        { width: 110 },
      );

      // Quantities & Calculations Line
      doc.font("Helvetica").fontSize(8).fillColor("#486581");
      doc.text(qty.toString(), MARGIN_X + 115, y, {
        width: 25,
        align: "center",
      });
      doc.text(rate.toFixed(2), MARGIN_X + 145, y, {
        width: 40,
        align: "right",
      });

      doc.font("Helvetica-Bold").fontSize(8).fillColor("#102a43");
      doc.text(amount.toFixed(2), MARGIN_X, y, {
        align: "right",
        width: RIGHT_TEXT_WIDTH,
      });

      y += 16;
    });

    drawLine(0.5, true);

    // ===== FINANCIAL TOTALS =====
    doc.font("Helvetica").fontSize(8.5).fillColor("#486581");

    // Subtotal
    doc.text("SubTotal", MARGIN_X, y);
    doc.text(`Rs. ${totalAmount.toFixed(2)}`, MARGIN_X, y, {
      align: "right",
      width: RIGHT_TEXT_WIDTH,
    });
    y += 14;

    // Discount
    doc.text("Discount", MARGIN_X, y);
    doc.text(`- Rs. ${order.discount.toFixed(2)}`, MARGIN_X, y, {
      align: "right",
      width: RIGHT_TEXT_WIDTH,
    });
    y += 14;

    // Delivery
    if (order?.deliveryCharges && order.deliveryCharges !== 0) {
      doc.text("Delivery Charges", MARGIN_X, y);
      doc.text(`+ Rs. ${order.deliveryCharges.toFixed(2)}`, MARGIN_X, y, {
        align: "right",
        width: RIGHT_TEXT_WIDTH,
      });
      y += 14;
    }

    y += 2;
    drawLine(0.5, false);

    // Grand Total Box Accent
    doc.font("Helvetica-Bold").fontSize(10).fillColor("#102a43");
    doc.text("TOTAL AMOUNT", MARGIN_X, y);
    doc.text(`Rs. ${order.payableAmount.toFixed(2)}`, MARGIN_X, y, {
      align: "right",
      width: RIGHT_TEXT_WIDTH,
    });
    y += 18;

    // ===== PAYMENT DETAILS =====
    doc.font("Helvetica").fontSize(8).fillColor("#627d98");
    doc.text(`Payment Method :  ${order.paymentMethod || "-"}`, MARGIN_X, y);
    y += 11;

    doc.text(`Payment Status :  ${order.paymentStatus || "-"}`, MARGIN_X, y);
    y += 18;

    drawLine(1, false);

    // ===== FOOTER BRAND SIGN-OFF =====
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor("#102a43")
      .text("THANK YOU FOR SHOPPING!", MARGIN_X, y, {
        width: CONTENT_WIDTH,
        align: "center",
      });

    doc.end();
  } catch (error) {
    console.error("Invoice PDF Error:", error);
    res.status(500).json({ message: "Failed to generate invoice PDF" });
  }
};
