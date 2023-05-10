import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./";

export const checkIfRoomExists = async (roomName: string) => {
  const docRef = doc(firestore, "/rooms", roomName);
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};
