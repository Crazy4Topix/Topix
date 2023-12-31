import React, { createContext, useEffect, useState } from 'react';
import { type Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

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

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SupabaseUserSession.Provider value={{ session, setSession }}>
      {children}
    </SupabaseUserSession.Provider>
  );
};
