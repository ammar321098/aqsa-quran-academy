"use client";

import { createContext, useContext } from "react";

export const SessionContext = createContext<any>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: any;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
