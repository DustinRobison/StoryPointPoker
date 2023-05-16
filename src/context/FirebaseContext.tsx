"use client";
import React from "react";
import {
  onAuthStateChanged,
  User,
  signInAnonymously,
  updateProfile,
  Auth,
  getAuth,
} from "firebase/auth";
import PageLoad from "@/components/page-load";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
  FieldValue,
  Firestore,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export interface IUser {
  name: string;
  active: boolean;
  vote: string;
}

export interface IAction {
  action: string;
  timestamp: string;
}

export interface IRoom {
  exists: boolean;
  ownerId: string;
  sharedText: string;
  messages: object[];
  users: { [key: string]: IUser };
  showVotes: boolean;
  createdAt: string | FieldValue;
  lastVoteTimestamp: string | FieldValue;
  history: IAction[];
  leaderOnly: boolean;
}

interface FirebaseContextData {
  app: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  user: User | null;
  loading: boolean;
  updateAuthProfileName: Function;
  createRoomRequest: Function;
  getRoomSnapshotRequest: Function;
  setRoomUpdateRequest: Function;
}

const defaultContext = {
  app: null,
  firestore: null,
  auth: null,
  user: null,
  loading: true,
  updateAuthProfileName: (newUsername: string) => {},
  createRoomRequest: async (
    roomName: string,
    user: User,
    firestore: Firestore
  ) => {},
  getRoomSnapshotRequest: async (roomName: string, firestore: Firestore) => {},
  setRoomUpdateRequest: async (
    roomName: string,
    updateObj: object,
    firestore: Firestore
  ) => {},
};

export const FirebaseContext =
  React.createContext<FirebaseContextData>(defaultContext);

export const useFirebaseContext = () => React.useContext(FirebaseContext);

export const FirebaseContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [app, setApp] = React.useState<FirebaseApp | null>(null);
  const [auth, setAuth] = React.useState<Auth | null>(null);
  const [firestore, setFirestore] = React.useState<Firestore | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const firebase = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_APIKEY,
      authDomain: process.env.NEXT_PUBLIC_AUTHDOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_DATABASEURL,
      projectId: process.env.NEXT_PUBLIC_PROJECTID,
      storageBucket: process.env.NEXT_PUBLIC_STORAGEBUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDERID,
      appId: process.env.NEXT_PUBLIC_APPID,
      measurementId: process.env.NEXT_PUBLIC_MEASUREMENTID,
    });
    const firestore = getFirestore(firebase);
    const auth = getAuth(firebase);
    setApp(firebase);
    setAuth(auth);
    setFirestore(firestore);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      signInAnonymously(auth)
        .then((userCredentail) => {
          setUser(userCredentail.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateAuthProfileName = async (newUsername: string) => {
    if (auth?.currentUser) {
      return await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });
    }
    throw new Error("Non Authenticated user name change failed!");
  };

  const createInitialRoomData = (
    roomName: string,
    user: User,
    firestore: Firestore
  ): IRoom => {
    return {
      exists: true,
      ownerId: user?.uid,
      sharedText: "",
      messages: [],
      users: {},
      showVotes: false,
      createdAt: serverTimestamp(),
      lastVoteTimestamp: serverTimestamp(),
      history: [
        {
          action: `${
            user?.displayName || user?.uid
          } has created room ${roomName}`,
          timestamp: new Date().toISOString(),
        },
      ],
      leaderOnly: false,
    };
  };

  const createRoomRequest = async (
    roomName: string,
    user: User,
    firestore: Firestore
  ) => {
    const docRef = await setDoc(
      doc(firestore, "rooms", roomName),
      createInitialRoomData(roomName, user, firestore)
    );
    return docRef;
  };

  const getRoomSnapshotRequest = async (
    roomName: string,
    firestore: Firestore
  ) => {
    const docRef = doc(firestore, "/rooms", roomName);
    return await getDoc(docRef);
  };

  const setRoomUpdateRequest = async (
    roomName: string,
    updateObj: object,
    firestore: Firestore
  ) => {
    const docRef = doc(firestore, "/rooms", roomName);
    return await updateDoc(docRef, updateObj);
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        updateAuthProfileName,
        app,
        auth,
        firestore,
        createRoomRequest,
        getRoomSnapshotRequest,
        setRoomUpdateRequest,
      }}
    >
      {user?.uid ? children : <PageLoad />}
    </FirebaseContext.Provider>
  );
};
