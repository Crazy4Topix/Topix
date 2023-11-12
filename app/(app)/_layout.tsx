import { Redirect, SplashScreen, Stack, Tabs } from 'expo-router';
import { useContext } from 'react';
import { SupabaseUserSession } from '../../contexts/user_session';
import { supabase } from '../../lib/supabase';
import { AudioPlayerProvider } from '../../contexts/audio_player';

export default function TabLayout() {
  const { setSession } = useContext(SupabaseUserSession);

  SplashScreen.preventAutoHideAsync();

  void supabase.auth.getSession().then(({ data: { session } }) => {
    if (session == null) {
      console.log('Redirecting to welcome');
      SplashScreen.hideAsync();
      return <Redirect href="/welcome" />;
    }
    setSession(session);
  });

  return (
    <AudioPlayerProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tab One',
          }}
        />
        <Tabs.Screen
          name="Mp3_player"
          options={{
            title: 'Tab two',
          }}
        />
        <Tabs.Screen
          name="Mp3_player_minum"
          options={{
            title: 'Tab three',
          }}
        />
      </Tabs>
    </AudioPlayerProvider>
  );
}
