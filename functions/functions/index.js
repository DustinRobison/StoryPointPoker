const functions = require("firebase-functions");

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require("firebase-admin");
admin.initializeApp();

// exports.deleteOldItems = functions.database.ref('/rooms/{roomName}')
//     .onWrite((change, context) => {
//         var ref = change.after.ref.parent; // reference to the items
//         var now = Date.now();
//         var cutoff = now - 8 * 60 * 60 * 1000;
//         var oldItemsQuery = ref.orderByChild('timestamp').endAt(cutoff);
//         return oldItemsQuery.once('value', function(snapshot) {
//             // create a map with all children that need to be removed
//             var updates = {};
//             snapshot.forEach(function(child) {
//                 updates[child.key] = null
//             });
//             // execute all updates in one go and return the result to end the function
//             return ref.update(updates);
//         });
//     });
