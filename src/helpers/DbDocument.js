import FirebaseApp from "../Firebase";

export const checkIfRoomExists = async debouncedRoomName => {
  const fbDoc = await FirebaseApp.firestore()
    .collection("/rooms")
    .doc(debouncedRoomName)
    .get();
  return fbDoc.exists;
};
