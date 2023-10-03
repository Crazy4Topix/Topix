import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import {NativeWindStyleSheet} from "nativewind";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


NativeWindStyleSheet.setOutput({
    default: "native",
});

export default function RootLayout() {

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
