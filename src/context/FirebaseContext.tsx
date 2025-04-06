
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  Auth, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';
import { auth, db, storage } from '@/lib/firebase';

interface FirebaseContextProps {
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  currentUser: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextProps | null>(null);

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

interface FirebaseProviderProps {
  children: ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const value = {
    auth,
    db,
    storage,
    currentUser,
    signIn,
    signUp,
    logOut,
    signInWithGoogle,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};
