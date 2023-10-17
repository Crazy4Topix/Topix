import React, { createContext, useState } from 'react';
import { type Session } from '@supabase/supabase-js';

interface ProvidersProps {
  readonly children: JSX.Element;
}

export const SupabaseUserSession = createContext<{
  session: null | Session;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
}>({
  session: null,
  setSession: () => {},
});

export const SupabaseUserSessionProvider = ({ children }: ProvidersProps) => {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SupabaseUserSession.Provider value={{ session, setSession }}>
      {children}
    </SupabaseUserSession.Provider>
  );
};
