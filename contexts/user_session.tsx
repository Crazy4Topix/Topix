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
    // void supabase.auth.getSession().then(({ data: { session } }) => {
    //   console.log('Session', session);
    //   setSession(session);
    // });
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Session changed', session, _event);
      setSession(session);
    });
  }, []);

  return (
    <SupabaseUserSession.Provider value={{ session, setSession }}>
      {children}
    </SupabaseUserSession.Provider>
  );
};
