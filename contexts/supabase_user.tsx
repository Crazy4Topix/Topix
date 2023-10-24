import React, { createContext, useState } from 'react';
import { type User } from '@supabase/supabase-js';

interface ProvidersProps {
  readonly children: JSX.Element;
}

export const SupabaseUser = createContext<{
  user: null | User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const SupabaseUserProvider = ({ children }: ProvidersProps) => {
  const [user, setUser] = useState<User | null>(null);

  return <SupabaseUser.Provider value={{ user, setUser }}>{children}</SupabaseUser.Provider>;
};
