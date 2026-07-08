const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

dotenv.config({ path: path.resolve(__dirname, ".env") });
const adminRoutes = require("./routes/adminRoutes.js");
const userRoutes = require("./routes/userRoute.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const subCategoryRoutes = require("./routes/subCategoryRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes.js");
const applicationBannerRoutes = require("./routes/applicationBannerRoutes.js");
const applicationSmallBannerRoutes = require("./routes/applicationSmallBannerRoutes.js");
const blogRoutes = require("./routes/blogRoute.js");
const addressRoutes = require("./routes/addressRoutes.js");
const deliveryPersonRoutes = require("./routes/deliveryPersonRoutes.js");
const emailOtpRoutes = require("./routes/emailOtpRoutes.js");
const webBannersRoutes = require("./routes/webBannersRoutes.js");
const walletRoutes = require("./routes/walletRoutes.js");
const offerRoutes = require("./routes/offerRoutes.js");
const fireRoutes = require("./routes/fireRoutes.js");
const coinRuleRoutes = require("./routes/coinRuleRoutes.js");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const invoiceRoutes = require("./routes/invoiceRoutes.js");
const dashboardRoutes = require("./routes/dashboardRoutes.js");
const contactUsRoutes = require("./routes/contactUsRoutes.js");
const deliveryAccountingRoutes = require("./routes/deliveryAccountingRoutes.js");

const app = express();

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
// });

// Security + Logging
// app.use(limiter);
app.use(helmet()); // Adds secure HTTP headers
app.use(morgan("combined")); // Logs all requests in Apache combined format

// Enable CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admins", adminRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/websiteBanner", webBannersRoutes);
app.use("/api/applicationBanner", applicationBannerRoutes);
app.use("/api/applicationSmallBanner", applicationSmallBannerRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactUsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", emailOtpRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/delivery-persons", deliveryPersonRoutes);
// app.use("/api/fire", fireRoutes);
app.use("/api/coins", coinRuleRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/deliveryaccounting", deliveryAccountingRoutes);

app.use("/api/dashboard", dashboardRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack);
  res
    .status(500)
    .json({ success: false, message: "Something broke!", error: err.message });
});

app.get("/", (req, res) => {
  res.send({
    status: 200,
    msg: "GuptaJi Mens WearProject is running Perfectly ...",
  });
});
// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
