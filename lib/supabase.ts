import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Alert } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl == null || supabaseAnonKey == null) {
  throw new Error('Missing env variables SUPABASE_URL or SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function signInWithEmail(email: string, password: string) {
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error != null) {
    Alert.alert(error.message);
    return { error, data: null };
  }

  return { error: null, data };
}

export async function signUpWithEmail(email: string, password: string) {
  console.log('signUpWithEmail', email, password);
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error != null) {
    console.log(error);
    Alert.alert(error.message);
    return { error, data: null };
  }

  return { error: null, data };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error != null) {
    Alert.alert(error.message);
    return { error };
  }

  return { error: null };
}

export async function getFullName(userId: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', userId)
      .single(); // Assuming you want to fetch a single profile

    if (error != null) {
      console.log(error.message);
      return { error };
    }

    return profile?.full_name || null;
  } catch (error) {
    console.error('Error fetching full name:', (error as Error).message);
    return null;
  }
}