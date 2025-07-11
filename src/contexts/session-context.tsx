"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface SessionContextType {
  session: string;
  setSession: (session: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState("");

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within an SessionProvider");
  }
  return context;
};
