// initialize firebase (https://firebase.google.com/docs/web/setup?authuser=0#config-object)
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

// These are not secret, they are only used for identifying my back end within firebase/google cloud
const FirebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB_CSQJO3D0EEuw_tocXqUWtw251AGdRQU",
  authDomain: "storypointers.firebaseapp.com",
  databaseURL: "https://storypointers.firebaseio.com",
  projectId: "storypointers",
  storageBucket: "storypointers.appspot.com",
  messagingSenderId: "737371107997",
  appId: "1:737371107997:web:994c00413846f100a31a74",
  measurementId: "G-Y7TZMB6YT7"
});

FirebaseApp.analytics();

export default FirebaseApp;
