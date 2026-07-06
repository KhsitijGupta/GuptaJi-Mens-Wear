// const admin = require("firebase-admin");
// const { google } = require("googleapis");

// // __dirname is already available in CommonJS

// const serviceAccount = {
//   type: "service_account",
//   project_id: process.env.FIREBASE_PROJECT_ID,
//   private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
//   private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   client_email: process.env.FIREBASE_CLIENT_EMAIL,
//   client_id: process.env.FIREBASE_CLIENT_ID,
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
// };

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//   });
// }

// // Function to send a notification to a device
// async function sendNotification(tokens, title, body) {
//   if (!Array.isArray(tokens)) tokens = [tokens];

//   const message = {
//     tokens,
//     notification: { title, body },
//     data: {
//       screen: "Notification",
//       navigateTo: "Notification",
//       click_action: "default",
//     },
//     android: {
//       priority: "high",
//       notification: {
//         sound: "default",
//         channelId: "high_importance_channel",
//       },
//     },
//     apns: {
//       headers: {
//         "apns-priority": "10",
//       },
//       payload: {
//         aps: {
//           alert: { title, body },
//           sound: "default",
//         },
//       },
//     },
//   };

//   try {
//     const response = await admin.messaging().sendEachForMulticast(message);
//     console.log("Notification sent:", response);
//     return response;
//   } catch (error) {
//     console.error("FCM Error:", error);
//     throw error;
//   }
// }

// // Function to get an access token using Google OAuth2
// async function getAccessToken() {
//   const auth = new google.auth.GoogleAuth({
//     keyFile: path.join(__dirname, "./serviceAccountKey.json"),
//     scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
//   });

//   try {
//     const accessToken = await auth.getAccessToken();
//     console.log("Access Token:", accessToken);
//     return accessToken;
//   } catch (error) {
//     console.error("Error fetching access token:", error);
//     throw error;
//   }
// }

// // Export in CommonJS
// module.exports = {
//   sendNotification,
//   getAccessToken,
// };
