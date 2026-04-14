
import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  connectAuthEmulator,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import app, { useEmulators, functions } from "@/lib/firebase";
import type { UserRole } from "@/lib/types";

const auth = getAuth(app);

const g = globalThis as unknown as { _authEmulatorConnected?: boolean };
if (useEmulators && !g._authEmulatorConnected) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  g._authEmulatorConnected = true;
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ hd: "malenovska.cz" });

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  signIn: () => Promise<void>;
  signInAs: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u) {
        const tokenResult = await u.getIdTokenResult();
        setRole((tokenResult.claims.role as UserRole) ?? null);
      } else {
        setRole(null);
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  const resolveRole = async (u: User) => {
    // Ensure custom claims are set (handles first-time sign-in race condition)
    const checkEligibility = httpsCallable<void, { role: string | null }>(functions, "checkAdminEligibility");
    await checkEligibility();

    // Force token refresh to pick up new claims
    await u.getIdToken(true);
    const tokenResult = await u.getIdTokenResult();
    const assignedRole = tokenResult.claims.role as UserRole | undefined;

    if (!assignedRole) {
      await firebaseSignOut(auth);
      throw new Error("NOT_AUTHORIZED");
    }

    setRole(assignedRole);
  };

  const signIn = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await resolveRole(result.user);
  };

  const signInAs = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await resolveRole(result.user);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, role, signIn, signInAs, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
