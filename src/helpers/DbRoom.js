import FirebaseApp from "../Firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../components/auth/Auth";

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
    messages: []
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
            messages
          } = doc.data();
          setState({
            ...state,
            loading: false,
            exists: doc.exists,
            ownerId,
            sharedText,
            showVotes,
            users,
            messages
          });
        });
    }
    return () => {
      if (unsubscribe) {
        console.log("unsubscribing from connection");
        unsubscribe();
      }
    };
  }, [roomName, currentUser]);

  const addUser = () => {
    if (state.docRef && currentUser && currentUser.uid) {
      state.docRef.update({
        [`users.${currentUser.uid}`]: {
          name: currentUser.displayName,
          active: true
        }
      });
    }
  };

  const removeUser = () => {
    if (state.docRef && currentUser && currentUser.uid) {
      state.docRef.update({
        [`users.${currentUser.uid}.active`]: false
      });
    }
  };

  const clearVotes = () => {
    console.log("clear votes");
  };

  const showVotes = () => {};

  const handleVote = vote => {};

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
    showVotes,
    handleVote,
    setSharedText
  };
};
