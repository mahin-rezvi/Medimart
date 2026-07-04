"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/nextjs";

interface AuthUser {
  uid: string;
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
  role?: string;
  phoneNumber?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

const fallbackValue: AuthContextType = {
  user: null,
  loading: false,
  isAdmin: false,
  signOut: async () => {},
};

function ClerkAuthBridge({ children }: { children: React.ReactNode }) {
  const { isLoaded, signOut: clerkSignOut } = useClerkAuth();
  const { isLoaded: userLoaded, user: clerkUser } = useUser();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !userLoaded) {
      setLoading(true);
      return;
    }

    if (clerkUser) {
      const role = (clerkUser.publicMetadata?.role as string | undefined) ?? "CUSTOMER";
      setUser({
        uid: clerkUser.id,
        displayName: clerkUser.fullName ?? clerkUser.firstName ?? clerkUser.username ?? null,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? null,
        photoURL: clerkUser.imageUrl ?? null,
        role,
        phoneNumber: clerkUser.phoneNumbers?.[0]?.phoneNumber ?? null,
      });
    } else {
      setUser(null);
    }

    setLoading(false);
  }, [clerkUser, isLoaded, userLoaded]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    loading,
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
    signOut: async () => {
      try {
        await clerkSignOut();
      } catch (err) {
        console.warn("[auth-provider] Clerk sign-out failed:", err);
      }
    },
  }), [clerkSignOut, loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return <AuthContext.Provider value={fallbackValue}>{children}</AuthContext.Provider>;
  }

  return <ClerkAuthBridge>{children}</ClerkAuthBridge>;
}

export function useAuth() {
  return useContext(AuthContext);
}
