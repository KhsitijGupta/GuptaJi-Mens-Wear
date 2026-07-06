const mongoose = require("mongoose");

const fcmTokenSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    fcmToken: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model("Fire", fcmTokenSchema);
