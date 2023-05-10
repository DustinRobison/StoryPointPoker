import { FieldValue } from "@google-cloud/firestore";
import { User } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "./";

interface IUser {
  name: string;
  active: boolean;
  vote: string;
}

interface IAction {
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

export const createInitialRoomData = (roomName: string, user: User): IRoom => {
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

export const createRoomRequest = async (roomName: string, user: User) => {
  const docRef = await setDoc(
    doc(firestore, "rooms", roomName),
    createInitialRoomData(roomName, user)
  );
  return docRef;
};

export const getRoomSnapshotRequest = async (roomName: string) => {
  const docRef = doc(firestore, "/rooms", roomName);
  return await getDoc(docRef);
};

export const setRoomUpdateRequest = async (
  roomName: string,
  updateObj: object
) => {
  const docRef = doc(firestore, "/rooms", roomName);
  return await updateDoc(docRef, updateObj);
};
