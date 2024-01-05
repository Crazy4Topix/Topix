import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName, isPremium } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';
import { Icon } from '@rneui/themed';
import { Redirect } from 'expo-router';

export default function ProfilePage() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [userIsPremium, setUserIsPremium] = useState(false);

  useEffect(() => {
    if (userId) { // Check if userId is defined
      const fetchFullName = async () => {
        try {
          const name = await getFullName(userId);
          if (name !== null) {
            setFullName(name);
          } else {
            console.log('Error fetching full name.');
          }
        } catch (error: any) {
          console.error('Error fetching full name:', error.message);
        }
      };

      void fetchFullName();
      isPremium(userId).then((premium: boolean) => {
        setUserIsPremium(premium);
      }).catch((error: any) => {
        console.error('Error fetching premium status:', error.message);
      });
    }
  }, [userId]);

  const handleLogout = async () => {
    try {
      await signOut();
      // @ts-expect-error: route is there
      navigation.navigate('welcome');
    } catch (e: any) {
      console.error('Error logging out:', e.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const navigateTopicSelection = () => {
    // @ts-expect-error: route is there
    navigation.navigate('updateTopics');
  };

  const navigateBuyPremium = () => {
    // @ts-expect-error: route is there
    navigation.navigate('buyPremium');
  }

  const navigateVoiceSelection = () => {
    // @ts-expect-error: route is there
    navigation.navigate('updateVoice');
  };

  if (fullName === null) {
    ToastAndroid.show('Account is niet compleet, neem contact op met Crazy4.', ToastAndroid.LONG);
    return <Redirect href="/login" />;
  }

  return (
    <View className="flex-1 justify-center content-center bg-white px-20">
      <View className="absolute top-12 left-4 z-10">
        <Pressable onPress={handleGoBack}>
          <Icon name="keyboard-return" size={36} color="black" />
        </Pressable>
      </View>
      <Text className="mb-2 font-primary_bold text-center text-xl">{fullName}</Text>
      {userIsPremium ? (
        <Text className="mb-4 font-primary text-xl text-center text-yellow-600">Premium</Text>
      ) : (
        <>
          <Text className="mb-4 font-primary text-xl text-center">Gratis gebruiker</Text>
          <View className="mb-4 rounded-md bg-yellow-600 p-2">
            <Pressable onPress={navigateBuyPremium}>
              <Text className="font-primary text-white">Koop premium</Text>
            </Pressable>
          </View>
        </>
      )
      }

      <View className="mb-4 rounded-md bg-primary p-2">
        <Pressable onPress={navigateTopicSelection}>
          <Text className="font-primary text-white">Selecteer Topix</Text>
        </Pressable>
      </View>

      <View className="mb-4 rounded-md bg-primary p-2">
        <Pressable onPress={navigateVoiceSelection}>
          <Text className="font-primary text-white">Selecteer stem</Text>
        </Pressable>
      </View>

            <Pressable onPress={() => {
            // @ts-expect-error: route is there
            navigation.navigate('(clone)');
            }}>
            <View className="rounded-md bg-primary p-2 mb-4">
                <Text className="font-primary text-white">Creëer je stem</Text>
            </View>
            </Pressable>

            {/* Logout Button */}
            <Pressable onPress={() => {
              void handleLogout();
            }}>
                <View className="rounded-md bg-primary p-2 mb-4">
                <Text className="font-primary text-white">Uitloggen</Text>
                </View>
            </Pressable>
        </View>  
    );
}