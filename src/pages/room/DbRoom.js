import { useContext, useEffect, useState } from "react";
import { isObject, reduce } from "lodash";
import firebase from "firebase/app";
import "@firebase/firestore";

import FirebaseApp from "../../Firebase";
import { AuthContext } from "../../components/auth/Auth";

export const checkIfRoomExists = async roomName => {
  const fbDoc = await FirebaseApp.firestore()
    .collection("/rooms")
    .doc(roomName)
    .get();
  return fbDoc.exists;
};

export const useRoom = roomName => {
  const { currentUser } = useContext(AuthContext);
  const [state, setState] = useState({
    docRef: FirebaseApp.firestore()
      .collection("/rooms")
      .doc(roomName),
    loading: false,
    error: "",
    exists: true,
    ownerId: "",
    sharedText: "",
    showVotes: false,
    messages: [],
    users: [],
    history: [],
    lastVoteTimestamp: 0,
    leaderOnly: false
  });

  const {
    docRef
    // loading,
    // error,
    // exists,
    // ownerId,
    // sharedText,
    // showVotes,
    // messages,
    // users,
    // history,
    // lastVoteTimestamp
  } = state;

  useEffect(() => {
    let unsubscribe;
    if (roomName && currentUser && currentUser.uid) {
      setState({
        ...state,
        loading: true
      });
      unsubscribe = FirebaseApp.firestore()
        .collection("/rooms")
        .doc(roomName)
        .onSnapshot(doc => {
          const {
            ownerId,
            sharedText,
            showVotes,
            users,
            messages,
            history,
            lastVoteTimestamp,
            leaderOnly
          } = doc.data();
          setState({
            ...state,
            loading: false,
            exists: doc.exists,
            ownerId,
            sharedText,
            showVotes,
            users,
            messages,
            history,
            lastVoteTimestamp:
              (lastVoteTimestamp && lastVoteTimestamp.seconds) || 0,
            leaderOnly
          });
        });
    }
    return () => (unsubscribe ? unsubscribe() : {});
    // eslint-disable-next-line
  }, [roomName, currentUser]);

  const getActiveUsersUids = () => {
    const { users } = state;
    return isObject(users)
      ? Object.keys(users).filter(key => users[key].active)
      : [];
  };

  const addUser = () => {
    // Check for required data
    if (docRef && currentUser && currentUser.uid && currentUser.displayName) {
      docRef.update({
        [`users.${currentUser.uid}`]: {
          name: currentUser.displayName,
          active: true,
          vote: "-"
        },
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `User ${currentUser.displayName} has joined the room.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const removeUser = uid => {
    if (docRef) {
      docRef.update({
        [`users.${uid}.active`]: false
      });
    }
  };

  const clearVotes = () => {
    if (docRef) {
      const userUids = getActiveUsersUids();
      const updateObject = reduce(
        userUids,
        (acc, uid) => {
          return { ...acc, [`users.${uid}.vote`]: "-" };
        },
        {}
      );
      docRef.update({
        ...updateObject,
        showVotes: false,
        lastVoteTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `${currentUser.displayName} has cleared the votes.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const updateUserName = async name => {
    if (docRef) {
      const oldName = currentUser.displayName;
      await currentUser.updateProfile({
        displayName: name
      });
      await docRef.update({
        [`users.${currentUser.uid}.name`]: name,
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `User ${oldName} has changed names to ${name}.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const setShowVotes = showVotes => {
    if (docRef) {
      docRef.update({
        showVotes,
        lastVoteTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `${currentUser.displayName} has shown the votes.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const handleVote = vote => {
    if (docRef) {
      docRef.update({
        [`users.${currentUser.uid}.vote`]: vote,
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `${currentUser.displayName} has voted.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const setSharedText = sharedText => {
    if (docRef) {
      docRef.update({
        sharedText
      });
    }
  };

  const toggleLeaderOnlyActions = () => {
    if (docRef) {
      docRef.update({
        leaderOnly: !state.leaderOnly
      });
    }
  };

  return {
    ...state,
    addUser,
    removeUser,
    clearVotes,
    setShowVotes,
    handleVote,
    setSharedText,
    updateUserName,
    getActiveUsersUids,
    toggleLeaderOnlyActions
  };
};
