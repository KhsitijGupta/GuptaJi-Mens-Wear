const mongoose = require("mongoose");

const adminnotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminNotification = mongoose.model('AdminNotification', adminnotificationSchema);

module.exports = AdminNotification;
