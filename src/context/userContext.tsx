import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { createFirebaseApp } from "../firebase/clientApp";

type UserContextType = {
  user: User | null;
  isLoading?: boolean;
  setUser?: Dispatch<SetStateAction<User>>;
};

const UserContext = createContext<UserContextType>({ user: null });

type Props = {
  children?: JSX.Element;
};

export default function UserContextComp({ children }: Props): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    // Listen authenticated user
    const app = createFirebaseApp();
    const auth = getAuth(app);
    const unSubscriber = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in.
          const { uid, displayName, email, photoURL } = user;
          // You could also look for the user doc in your Firestore (if you have one):
          // const userDoc = await firebase.firestore().doc(`users/${uid}`).get()
          setUser(user);
        } else setUser(null);
      } catch (error) {
        // Most probably a connection error. Handle appropriately.
      } finally {
        setIsLoading(false);
      }
    });

    // Unsubscribe auth listener on unmount
    return () => unSubscriber();
  }, []);

  return (
    <UserContext.Provider
      value={{ user: user, setUser: setUser, isLoading: isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook that shorthands the context!
export const useUser = () => useContext(UserContext);
