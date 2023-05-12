const functions = require("firebase-functions");

const { deleteOldRooms } = require("./triggers/DeleteOldRooms");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

// [START TRIGGERS]
exports.scheduleJobs = functions.pubsub
  .schedule("every day 03:00")
  .onRun(deleteOldRooms);
// [END TRIGGERS]

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });
