import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'

export default function ProfilePage() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const userContext = useContext(SupabaseUserSession);
    const userId = userContext.session?.user.id; // Replace with the actual user ID from Supabase
    
  
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
  
    useEffect(() => {
        console.log(userId)
      const fetchFullName = async () => {
        try {
          if (userId) { // Check if userId is defined
            const name = await getFullName(userId);
            if (name !== null) {
                setFullName(name);
            } else {
                // Handle the error or provide a default value
                Alert.alert('Error fetching full name.');
            }
          }
        } catch (error) {
          console.error('Error fetching full name:', error.message);
          Alert.alert('Error fetching full name.');
        }
      };
  
      void fetchFullName();
    }, [userId]);
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl font-semibold mb-4">Profiel Pagina</Text>

      {/* Display Name */}
      <Text className="text-xl mb-2">{fullName}</Text>

      {/* Topic Selection Button */}
      <Pressable onPress={handleTopicSelection}>
        <View className="bg-primary p-2 rounded-md mb-4">
          <Text className="text-white">Selecteer Topix</Text>
        </View>
      </Pressable>

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="bg-primary p-2 rounded-md">
          <Text className="text-white">Uitloggen</Text>
        </View>
      </Pressable>
    </View>
  );
}
