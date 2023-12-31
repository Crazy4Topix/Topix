import 'react-native-url-polyfill/auto'; // DO NOT REMOVE THIS LINE, very weird error otherwise
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
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error != null) {
    console.error(error);
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
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single();

  if (error != null) {
    console.error(error.details);
    return null;
  }
  
  return profile?.full_name || null;
}

export async function getSampleBySpeakerId(speakerId: string) {
  try {
    const { data } = supabase
      .storage
      .from('audio')
      .getPublicUrl(`samples/${speakerId}/sample.mp3`)

    return data.publicUrl;
  } catch (error) {
    console.error('Error fetching sample:', (error as Error));
    return null;
  }
}

export async function isPremium(userId: string) {
  try {
    const { data: premium, error } = await supabase
      .from('profiles')
      .select('premium')
      .eq('id', userId)
      .single(); // Assuming you want to fetch a single profile

    if (error != null) {
      throw new Error(error.message);
    }

    return premium.premium


  } catch (error) {
    console.error('Error fetching full name:', (error as Error).message);
    return false;
  }
}

// For demo purposes only
export async function buyPremium(userId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ premium: true })
      .eq('id', userId)
      .single(); // Assuming you want to fetch a single profile

    if (error != null) {
      throw new Error(error.message);
    }

    return true
  }catch (error) {
    console.error('Error buying premium:', (error as Error).message);
    return false;
  }
}

export async function getSample(userId: string) {
  try {
    const { data: speaker, error } = await supabase
      .from('speakers')
      .select('id')
      .eq('custom_voice_owner', userId)
      .single(); // Assuming you want to fetch a single profile

    if (error != null) {
      throw new Error(error.message);
    }


    const { data } = supabase
      .storage
      .from('audio')
      .getPublicUrl(`samples/${speaker.id}/sample.mp3`)

    return data.publicUrl;
  } catch (error) {
    console.error('Error fetching full name:', (error as Error).message);
    return null;
  }
}