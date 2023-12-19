import React, { createContext, useEffect, useState } from 'react';
import { type Session, type User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface ProvidersProps {
  readonly children: JSX.Element;
}

export const SupabaseUserSession = createContext<{
  session: null | Session;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  user: null | User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  session: null,
  setSession: () => {},
  user: null,
  setUser: () => {},
});

export const SupabaseUserSessionProvider = ({ children }: ProvidersProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {

      if(session === null){
        setUser(null);
      }

      console.log('Session changed', session, _event);
      setSession(session);
    });
  }, []);

  return (
    <SupabaseUserSession.Provider value={{ session, setSession, user, setUser }}>
      {children}
    </SupabaseUserSession.Provider>
  );
};
