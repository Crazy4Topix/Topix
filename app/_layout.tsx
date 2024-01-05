// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="nativewind/types" />
import { Stack, SplashScreen } from 'expo-router';

import { NativeWindStyleSheet } from 'nativewind';
import { SupabaseUserSessionProvider } from '../contexts/user_session';
import { useFonts } from 'expo-font';
import {
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import SignUpHeader from '../components/SignUpHeader';
import { SupabaseUserProvider } from '../contexts/supabase_user';
import { AudioPlayerProvider } from '../contexts/audio_player';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export const unstable_settings = {
  initialRouteName: '(app)',
};

export default function RootLayout() {
  // AppRegistry.registerComponent(...);


  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <SupabaseUserSessionProvider>
      <SupabaseUserProvider>
        <AudioPlayerProvider>

          <Stack
            screenOptions={{
              header: (props) => <SignUpHeader {...props} />,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen
              name="(app)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name={'welcome'}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name={'signup'} />
            <Stack.Screen
              name={'login'}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name={'userInformation'} />
            <Stack.Screen name={'topicSelection'} />
            <Stack.Screen name={'voiceSelection'} />
            
          </Stack>
        </AudioPlayerProvider>
      </SupabaseUserProvider>
    </SupabaseUserSessionProvider>
  );
}
