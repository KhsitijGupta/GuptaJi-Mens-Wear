const fireModel = require("../models/fireModel");
const Notification = require("../models/notificationModel");
const { sendNotification } = require("../services/firebaseService");

// -------------------------------------------------------
// Get all FCM tokens for a user
// -------------------------------------------------------
module.exports.getFcmTokenbyidController = async (req, res) => {
  const { userId } = req.params;

  try {
    const tokens = await fireModel.find({ userId, isActive: true });
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------------------------------------------
// Send notification to all active tokens of the user
// -------------------------------------------------------
module.exports.sendNotificationToUserTokens = async (req, res) => {
  const { id } = req.params;
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    // Fetch only ACTIVE tokens
    const tokensData = await fireModel.find({ userId: id });
    const tokens = tokensData.map((doc) => doc.fcmToken);

    if (tokens.length === 0) {
      return res
        .status(404)
        .json({ message: "No active tokens found for this user" });
    }

    const response = await sendNotification(tokens, title, body);

    res.status(200).json({
      success: response.successCount,
      failure: response.failureCount,
    });
  } catch (error) {
    console.error("Notification sending error:", error);
    res.status(500).json({ message: "Failed to send notification" });
  }
};

// -------------------------------------------------------
// Common Middleware for sending notifications
// -------------------------------------------------------
module.exports.sendNotificationMiddleware = async (userId, title, body) => {
  if (!userId || !title || !body) {
    throw new Error("userId, title, and body are required");
  }

  try {
    const tokensData = await fireModel.find({ userId, isActive: true });
    const tokens = tokensData.map((doc) => doc.fcmToken);

    if (tokens.length === 0) {
      throw new Error("No active tokens found for this user");
    }

    const response = await sendNotification(tokens, title, body);

    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        fireModel
          .updateOne({ fcmToken: tokens[index] }, { isActive: false })
          .exec();
      }
    });

    await Notification.create({
      userId,
      title,
      body,
    });

    return {
      success: response.successCount,
      failure: response.failureCount,
    };
  } catch (error) {
    console.error("Notification helper error:", error);
    throw error;
  }
};

// -------------------------------------------------------
// Delete Notification
// -------------------------------------------------------
module.exports.deleteNotificationController = async (req, res) => {
  const { _id } = req.params;

  try {
    const deleted = await Notification.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting notification" });
  }
};

// -------------------------------------------------------
// Get Notifications for logged-in user
// -------------------------------------------------------
module.exports.getNotificationController = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const notifications = await Notification.find({ userId }).sort({
      sentAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
// -------------------------------------------------------
// Get Notifications for Admin
// -------------------------------------------------------
module.exports.getadminNotificationController = async (req, res) => {
  const { id } = req.params;

  try {
    const notifications = await Notification.find({ userId:id }).sort({
      sentAt: -1,
    });

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// -------------------------------------------------------
// Admin: Send notification to ALL active tokens
// -------------------------------------------------------
module.exports.sendNotificationToAllController = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: "Title and body are required" });
  }

  try {
    // Step 1 — Get all active tokens
    const tokensData = await fireModel.find();
    const tokens = tokensData.map((doc) => doc.fcmToken);

    if (tokens.length === 0) {
      return res.status(404).json({ message: "No active tokens found" });
    }

    // Step 2 — Send the notification
    const response = await sendNotification(tokens, title, body);

    // Step 3 — If token is invalid, deactivate it
    response.responses.forEach((resp, index) => {
      if (!resp.success) {
        fireModel
          .updateOne({ fcmToken: tokens[index] }, { isActive: false })
          .exec();
      }
    });

    // Step 4 — Store admin broadcast notification
    await Notification.create({
      userId: "admin",
      title,
      body,
    });

    return res.status(200).json({
      message: "Notification sent to all users",
      success: response.successCount,
      failure: response.failureCount,
    });
  } catch (error) {
    console.error("Admin notification error:", error);
    return res.status(500).json({ message: "Failed to send notifications" });
  }
};
