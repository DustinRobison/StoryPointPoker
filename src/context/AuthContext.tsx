"use client";
import React, { Suspense } from "react";
import {
  onAuthStateChanged,
  getAuth,
  User,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";
import { app } from "@/firebase";
import PageLoad from "@/components/page-load";

const auth = getAuth(app);

interface AuthContextData {
  user: User | null;
  loading: boolean;
  updateAuthProfileName: Function;
}

export const AuthContext = React.createContext<AuthContextData>({
  user: null,
  loading: true,
  updateAuthProfileName: (newUsername: string) => {},
});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const updateAuthProfileName = async (newUsername: string) => {
    if (auth?.currentUser) {
      return await updateProfile(auth.currentUser, {
        displayName: newUsername,
      });
    }
    throw new Error("Non Authenticated user name change failed!");
  };

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
    <AuthContext.Provider value={{ user, loading, updateAuthProfileName }}>
      <Suspense fallback={PageLoad}>{children}</Suspense>
    </AuthContext.Provider>
  );
};
