"use client";

import { AuthContext } from "@/context/AuthContext";
import { firestore } from "@/firebase";
import { IRoom, setRoomUpdateRequest } from "@/firebase/db-room";
import {
  Unsubscribe,
  arrayUnion,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { isObject, reduce, set } from "lodash";
import { useContext, useEffect, useState } from "react";

const getInitRoomState = (): IRoom => ({
  exists: true,
  ownerId: "",
  sharedText: "",
  showVotes: false,
  messages: [],
  users: {},
  history: [],
  createdAt: "",
  lastVoteTimestamp: "",
  leaderOnly: false,
});

export const useRoom = (roomName: string) => {
  const { user, updateAuthProfileName } = useContext(AuthContext);
  const [state, setState] = useState<IRoom>(getInitRoomState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // @ts-ignore
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (roomName && user?.uid) {
      setLoading(true);
      unsubscribe = onSnapshot(doc(firestore, "rooms", roomName), (roomDoc) => {
        // @ts-ignore
        const {
          ownerId,
          sharedText,
          showVotes,
          users,
          messages,
          history,
          lastVoteTimestamp,
          leaderOnly,
        }: IRoom = roomDoc.data();
        setState({
          ...state,
          exists: roomDoc.exists(),
          ownerId,
          sharedText,
          showVotes,
          users,
          messages,
          history,
          lastVoteTimestamp: lastVoteTimestamp || new Date().toISOString(),
          leaderOnly,
        });
        setLoading(false);
      });
    }
    return () => (unsubscribe ? unsubscribe() : {});
    // eslint-disable-next-line
  }, [roomName, user?.uid]);

  const getActiveUsersUids = () => {
    const { users } = state;
    if (isObject(users)) {
      return Object.keys(users).filter((key) => users[key]?.active);
    }
    return [];
  };

  const addUser = () => {
    // Check for required data
    if (user?.uid && user?.displayName) {
      setRoomUpdateRequest(roomName, {
        [`users.${user.uid}`]: {
          name: user.displayName,
          active: true,
          vote: "-",
        },
        history: arrayUnion({
          action: `User ${user.displayName} has joined the room.`,
          timestamp: serverTimestamp(),
        }),
      });
    }
  };

  const removeUser = (uid: string) => {
    setRoomUpdateRequest(roomName, {
      [`users.${uid}.active`]: false,
    });
  };

  const clearVotes = () => {
    const userUids = getActiveUsersUids();
    const updateObject = reduce(
      userUids,
      (acc, uid) => {
        return { ...acc, [`users.${uid}.vote`]: "-" };
      },
      {}
    );
    setRoomUpdateRequest(roomName, {
      ...updateObject,
      showVotes: false,
      lastVoteTimestamp: serverTimestamp(),
      history: arrayUnion({
        action: `${user?.displayName} has cleared the votes.`,
        timestamp: serverTimestamp(),
      }),
    });
  };

  const updateUserName = async (newName: string) => {
    const oldName = user?.displayName;
    await updateAuthProfileName(newName);
    await setRoomUpdateRequest(roomName, {
      [`users.${user?.uid}.name`]: newName,
      history: arrayUnion({
        action: `User ${oldName} has changed names to ${newName}.`,
        timestamp: serverTimestamp(),
      }),
    });
  };

  return {
    ...state,
    addUser,
    removeUser,
    clearVotes,
  };
};
