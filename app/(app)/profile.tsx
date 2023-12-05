import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';
import { Icon } from 'react-native-elements';

export default function ProfilePage() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;

  const handleLogout = async () => {
    try {
      await signOut();
      // @ts-expect-error It complains about never but it is there
      navigation.navigate('welcome');
    } catch (e: any) {
      console.error('Error logging out:', e.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack(); // Go back to the previous screen
  };

  const navigateTopicSelection = () => {
    // @ts-expect-error It complains about never but it is there
    navigation.navigate('updateTopics');
  };

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        if (userId) {
          // Check if userId is defined
          const name = await getFullName(userId);
          if (name !== null) {
            setFullName(name);
          } else {
            console.error('Error fetching full name.');
          }
        }
      } catch (error: any) {
        console.error('Error fetching full name:', error.message);
      }
    };

    void fetchFullName();
  }, [userId]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="absolute left-4 top-8 z-10">
        <Pressable onPress={handleGoBack}>
          <Icon name="keyboard-return" size={36} color="black" />
        </Pressable>
      </View>
      <Text className="mb-4 text-2xl font-semibold">Profiel Pagina</Text>

      {/* Display Name */}
      <Text className="mb-2 text-xl">{fullName}</Text>

      {/* Topic Selection Button */}
      <View className="mb-4 rounded-md bg-primary p-2">
        <Pressable onPress={navigateTopicSelection}>
          <Text className="text-white">Selecteer Topix</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="rounded-md bg-primary p-2">
          <Text className="text-white">Uitloggen</Text>
        </View>
      </Pressable>
    </View>
  );
}
