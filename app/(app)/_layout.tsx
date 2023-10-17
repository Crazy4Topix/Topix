import { Redirect, Tabs } from 'expo-router';
import { useContext } from 'react';
import { SupabaseUserSession } from '../../contexts/user_session';

export default function TabLayout() {
  const { session } = useContext(SupabaseUserSession);

  if (session == null) {
    return <Redirect href="/welcome" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
        }}
      />
    </Tabs>
  );
}
