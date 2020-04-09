import { useContext, useEffect, useState } from "react";
import { reduce } from "lodash";
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
    lastVoteTimestamp: 0
  });

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
            lastVoteTimestamp
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
              (lastVoteTimestamp && lastVoteTimestamp.seconds) || 0
          });
        });
    }
    return () => {
      if (unsubscribe) {
        console.log("unsubscribing from connection");
        unsubscribe();
      }
    };
    // eslint-disable-next-line
  }, [roomName, currentUser]);

  const addUser = () => {
    // Check for required data
    if (
      state.docRef &&
      currentUser &&
      currentUser.uid &&
      currentUser.displayName
    ) {
      state.docRef.update({
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
    if (state.docRef) {
      state.docRef.update({
        [`users.${uid}.active`]: false
      });
    }
  };

  const clearVotes = userUids => {
    if (state.docRef && Array.isArray(userUids)) {
      const updateObject = reduce(
        userUids,
        (acc, uid) => {
          return { ...acc, [`users.${uid}.vote`]: "-" };
        },
        {}
      );
      state.docRef.update({
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
    if (state.docRef) {
      const oldName = currentUser.displayName;
      await currentUser.updateProfile({
        displayName: name
      });
      await state.docRef.update({
        [`users.${currentUser.uid}.name`]: name,
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `User ${oldName} has changed names to ${name}.`,
          timestamp: new Date().toISOString()
        })
      });
      return;
    }
  };

  const setShowVotes = showVotes => {
    if (state.docRef) {
      state.docRef.update({
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
    if (state.docRef) {
      state.docRef.update({
        [`users.${currentUser.uid}.vote`]: vote,
        history: firebase.firestore.FieldValue.arrayUnion({
          action: `${currentUser.displayName} has voted.`,
          timestamp: new Date().toISOString()
        })
      });
    }
  };

  const setSharedText = sharedText => {
    if (state.docRef) {
      state.docRef.update({
        sharedText
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
    updateUserName
  };
};
