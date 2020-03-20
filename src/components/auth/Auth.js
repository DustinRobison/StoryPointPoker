import React, { useEffect, useState, createContext } from "react";
import FirebaseApp from "../../Firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    FirebaseApp.auth().onAuthStateChanged(setCurrentUser);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

//
// export const createUser = async (email, phone, name) => {
//   const password = stringToNumbersOnlyString(phone);
//   try {
//     await FirebaseApp.auth().createUserWithEmailAndPassword(email, password);
//     const currentUser = await FirebaseApp.auth().currentUser;
//     await currentUser.updateProfile({
//       displayName: name
//     });
//     return { success: true, userId: currentUser.uid };
//   } catch (error) {
//     return { success: false, error };
//   }
// };
//
// export const signOut = async () => {
//   try {
//     await FirebaseApp.auth().signOut();
//   } catch (error) {}
// };
