const admin = require("firebase-admin");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

// __dirname is already available in CommonJS

const serviceAccount = JSON.parse(
  fs.readFileSync(path.join(__dirname, "./serviceAccountKey.json"))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Function to send a notification to a device
async function sendNotification(tokens, title, body) {
  if (!Array.isArray(tokens)) tokens = [tokens];

  const message = {
    tokens,
    notification: { title, body },
    data: {
      screen: "Notification",
      navigateTo: "Notification",
      click_action: "default",
    },
    android: {
      priority: "high",
      notification: {
        sound: "default",
        channelId: "high_importance_channel",
      },
    },
    apns: {
      headers: {
        "apns-priority": "10",
      },
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
        },
      },
    },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Notification sent:", response);
    return response;
  } catch (error) {
    console.error("FCM Error:", error);
    throw error;
  }
}

// Function to get an access token using Google OAuth2
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "./serviceAccountKey.json"),
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  try {
    const accessToken = await auth.getAccessToken();
    console.log("Access Token:", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

// Export in CommonJS
module.exports = {
  sendNotification,
  getAccessToken,
};
