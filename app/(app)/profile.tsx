import React, { useContext } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from '../../lib/supabase';

export default function ProfilePage() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut();
      // Navigate to the login page or replace 'LoginPage' with the desired screen name
      navigation.navigate('welcome');
    } catch (e) {
      console.error('Error logging out:', e.message);
    }
  };

  const handleTopicSelection = () => {
    // Navigate to the 'topicSelection' screen
    navigation.navigate('topicSelection');
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-semibold mb-4">Profile Page</Text>

      {/* Display Name */}
      <Text className="text-xl mb-2">Stefan</Text>

      {/* Topic Selection Button */}
      <Pressable onPress={handleTopicSelection}>
        <View className="bg-primary p-2 rounded-md mb-4">
          <Text className="text-white">Select Topix</Text>
        </View>
      </Pressable>

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="bg-primary p-2 rounded-md">
          <Text className="text-white">Logout</Text>
        </View>
      </Pressable>
    </View>
  );
}
