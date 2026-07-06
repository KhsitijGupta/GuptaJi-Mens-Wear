const express = require("express");

const {
  deleteNotificationController,
  getFcmTokenbyidController,
  getNotificationController,
  sendNotificationToUserTokens,
  sendNotificationToAllController,
  getadminNotificationController,
} = require("../controllers/fireController.js");

const { sendNotification } = require("../services/firebaseService.js");
const { authenticateUser, authorizeRoles } = require("../middleware/auth.js");
const Notification = require("../models/notificationModel.js");

const fireRouter = express.Router();

fireRouter.get(
  "/get-notification",
  authenticateUser,
  getNotificationController
);
fireRouter.get(
  "/admin/get-notification/:id",
  authenticateUser,
  authorizeRoles("admin"),
  getadminNotificationController
);

fireRouter.delete(
  "/delete-notification/:_id",
  authenticateUser,
  deleteNotificationController
);

fireRouter.get("/:userId", getFcmTokenbyidController);

fireRouter.post("/send/:id", sendNotificationToUserTokens);
fireRouter.post(
  "/admin/send-all",
  authenticateUser,
  authorizeRoles("admin"),
  sendNotificationToAllController
);

fireRouter.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const result = await sendNotification(token, title, body);
    await Notification.create({
      userId: "testing",
      title,
      body,
    });
    res.json({
      success: true,
      message: "Notification sent successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = fireRouter;
