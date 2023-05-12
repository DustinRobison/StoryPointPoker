// TODO update functions to gen 2

// import {differenceInMinutes} from "date-fns";
// import admin from "firebase-admin";
// import {logger} from "firebase-functions";
// import {onSchedule} from "firebase-functions/v2/scheduler";

// // Run once a day at midnight, to clean up the users
// // Manually run the task here https://console.cloud.google.com/cloudscheduler
// exports.accountcleanup = onSchedule("every day 03:00", async (event) => {
//   const currentDate = new Date();
//   admin
//     .firestore()
//     .collection("rooms")
//     .get()
//     .then((querySnapshot) => {
//       querySnapshot.forEach((doc) => {
//         const data = doc.data();
//         const lastVoteDate = data.lastVoteTimestamp.toDate();
//         if (differenceInMinutes(currentDate, lastVoteDate) > 180) {
//           admin.firestore().collection("rooms").doc(doc.id).delete();
//         }
//       });
//     });
//   logger.log("Room cleanup finished");
// });
