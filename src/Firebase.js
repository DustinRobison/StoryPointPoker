// initialize firebase (https://firebase.google.com/docs/web/setup?authuser=0#config-object)
let firebaseInstance;

const {
  REACT_APP_APIKEY,
  REACT_APP_AUTHDOMAIN,
  REACT_APP_DATABASEURL,
  REACT_APP_PROJECTID,
  REACT_APP_STORAGEBUCKET,
  REACT_APP_MESSAGINGSENDERID,
  REACT_APP_APPID,
  REACT_APP_MEASUREMENTID
} = process.env;

const config = {
  apiKey: REACT_APP_APIKEY,
  authDomain: REACT_APP_AUTHDOMAIN,
  databaseURL: REACT_APP_DATABASEURL,
  projectId: REACT_APP_PROJECTID,
  storageBucket: REACT_APP_STORAGEBUCKET,
  messagingSenderId: REACT_APP_MESSAGINGSENDERID,
  appId: REACT_APP_APPID,
  measurementId: REACT_APP_MEASUREMENTID
};

export const getFirebase = firebase => {
  if (firebaseInstance) {
    return firebaseInstance;
  }

  firebase.initializeApp(config);
  firebaseInstance = firebase;

  return firebase;
};

// These are not secret, they are only used for identifying my back end within firebase/google cloud
export default firebaseInstance;
