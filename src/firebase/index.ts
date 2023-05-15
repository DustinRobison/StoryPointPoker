"use client";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const {
  NEXT_PUBLIC_APIKEY,
  NEXT_PUBLIC_AUTHDOMAIN,
  NEXT_PUBLIC_DATABASEURL,
  NEXT_PUBLIC_PROJECTID,
  NEXT_PUBLIC_STORAGEBUCKET,
  NEXT_PUBLIC_MESSAGINGSENDERID,
  NEXT_PUBLIC_APPID,
  NEXT_PUBLIC_MEASUREMENTID,
} = process.env;

const firebaseConfig = {
  apiKey: NEXT_PUBLIC_APIKEY,
  authDomain: NEXT_PUBLIC_AUTHDOMAIN,
  databaseURL: NEXT_PUBLIC_DATABASEURL,
  projectId: NEXT_PUBLIC_PROJECTID,
  storageBucket: NEXT_PUBLIC_STORAGEBUCKET,
  messagingSenderId: NEXT_PUBLIC_MESSAGINGSENDERID,
  appId: NEXT_PUBLIC_APPID,
  measurementId: NEXT_PUBLIC_MEASUREMENTID,
};

export default () => {
  console.log(`init firebase app: ${firebaseConfig.apiKey}`);
  console.log(process.env);
  const app = initializeApp(firebaseConfig);
  console.log(app);
  const firestore = getFirestore(app);
  const auth = getAuth(app);

  return {
    app,
    firestore,
    auth,
  };
};
