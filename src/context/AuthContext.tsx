"use client";
import React from "react";
import {
  onAuthStateChanged,
  getAuth,
  User,
  signInAnonymously,
} from "firebase/auth";
import { app } from "@/firebase";

const auth = getAuth(app);

interface AuthContextData {
  user: User | null;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextData>({
  user: null,
  loading: true,
});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
