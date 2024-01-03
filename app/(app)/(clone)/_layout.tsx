import React, { useContext, useEffect, useState } from 'react';
import { SupabaseUserSession } from '../../../contexts/user_session';
import { Redirect, SplashScreen, Stack } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { AudioPlayerProvider } from '../../../contexts/audio_player';

export default function TabLayout() {
  const { setSession } = useContext(SupabaseUserSession);
  const [redirectToWelcome, setRedirectToWelcome] = useState(false);

  SplashScreen.preventAutoHideAsync();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session == null) {
        console.log('Redirecting to welcome');
        SplashScreen.hideAsync();
        setRedirectToWelcome(true);
      } else {
        setSession(session);
      }
    });
  }, []); // Empty dependency array to run the effect only once on component mount

  if (redirectToWelcome) {
    return <Redirect href="/welcome" />;
  }

  return (
    <AudioPlayerProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="Introduction"
          options={{
            title: 'Introduction',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateVoiceClone"
          options={{
            title: 'CreateVoiceClone',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Sample"
          options={{
            title: 'Sample',
            headerShown: false,
          }}
        />
      </Stack>
    </AudioPlayerProvider>
  );
}
