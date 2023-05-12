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
  // serverTimestamp, // cant use in nested update :(
} from "firebase/firestore";
import { reduce } from "lodash";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { user, updateAuthProfileName } = useContext(AuthContext);
  const [state, setState] = useState<IRoom>(getInitRoomState());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // @ts-ignore
  useEffect(() => {
    let unsubscribe: Unsubscribe;
    if (roomName && user?.uid) {
      setLoading(true);
      try {
        unsubscribe = onSnapshot(
          doc(firestore, "rooms", roomName),
          (roomDoc) => {
            if (!roomDoc.exists()) {
              console.log(`Error: room not found`);
              router.push("/");
              return;
            }

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
              createdAt,
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
              createdAt,
            });

            setLoading(false);
          }
        );
      } catch (err) {
        console.log(`Error: unable to get room doc`);
        router.push("/");
      }
    }
    return () => (unsubscribe ? unsubscribe() : {});
    // eslint-disable-next-line
  }, [roomName, user?.uid]);

  const getActiveUsersUids = () => {
    const { users } = state;
    if (users) {
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
          timestamp: new Date().toISOString(),
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
      lastVoteTimestamp: new Date().toISOString(),
      sharedText: "",
      history: arrayUnion({
        action: `${user?.displayName} has cleared the votes.`,
        timestamp: new Date().toISOString(),
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
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const handleVote = async (vote: string) => {
    setRoomUpdateRequest(roomName, {
      [`users.${user?.uid}.vote`]: vote,
      history: arrayUnion({
        action: `${user?.displayName} has voted.`,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const toggleLeaderOnlyActions = async () => {
    if (user?.uid === state.ownerId) {
      setRoomUpdateRequest(roomName, {
        leaderOnly: !state.leaderOnly,
      });
    }
  };

  const toggleShowVotes = async (showVotes: boolean) => {
    if (!state.leaderOnly || user?.uid === state.ownerId) {
      setRoomUpdateRequest(roomName, {
        showVotes,
        lastVoteTimestamp: serverTimestamp(),
        history: arrayUnion({
          action: `${user?.displayName} has shown the votes.`,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  };

  const toggleClearVotes = async () => {
    if (!state.leaderOnly || user?.uid === state.ownerId) {
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
          timestamp: new Date().toISOString(),
        }),
      });
    }
  };

  const setSharedText = async (sharedText: string) => {
    if (state.ownerId === user?.uid) {
      setRoomUpdateRequest(roomName, {
        sharedText,
      });
    }
  };

  return {
    ...state,
    loading,
    error,
    addUser,
    removeUser,
    clearVotes,
    handleVote,
    getActiveUsersUids,
    toggleLeaderOnlyActions,
    toggleShowVotes,
    toggleClearVotes,
    updateUserName,
    setSharedText,
  };
};
