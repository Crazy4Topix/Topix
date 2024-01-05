import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, ToastAndroid, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'
import { Icon } from '@rneui/themed';
import { Redirect } from 'expo-router';

export default function ProfilePage() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const userContext = useContext(SupabaseUserSession);
    const userId = userContext.session?.user.id;

    useEffect(() => {
        const fetchFullName = async () => {
            try {
                if (userId) { // Check if userId is defined
                    const name = await getFullName(userId);
                    if (name !== null) {
                        setFullName(name);
                    } else {
                        console.log('Error fetching full name.');
                    }
                }
            } catch (error: any) {
                console.error('Error fetching full name:', error.message);
            }
        };
        
        void fetchFullName();
    }, [userId]);

    const handleLogout = async () => {
        try {
            await signOut();
            navigation.navigate('welcome');
        } catch (e) {
            console.error('Error logging out:', e.message);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const navigateTopicSelection = () => {
        navigation.navigate('updateTopics');
    };

    const navigateVoiceSelection = () => {
        navigation.navigate('updateVoice')
    }

    if (fullName === null){
        ToastAndroid.show('Account is niet compleet, neem contact op met Crazy4.', ToastAndroid.LONG);
        return <Redirect href="/login" />;
    }
  
  return (
        <View className="flex-1 justify-center content-center bg-white px-20">
            <StatusBar barStyle="dark-content" />
            <View className="absolute top-8 left-4 z-10">
                <Pressable onPress={handleGoBack}>
                    <Icon name="keyboard-return" size={36} color="black" />
                </Pressable>
            </View>
            <Text className="text-2xl font-semibold mb-4 text-center">Profiel Pagina</Text>

            <Text className="mb-4 font-primary text-xl text-center">{fullName}</Text>

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
            navigation.navigate('(clone)', { error: (false).toString()});
            }}>
            <View className="rounded-md bg-primary p-2 mb-4">
                <Text className="font-primary text-white">creëer je stem</Text>
            </View>
            </Pressable>

            {/* Logout Button */}
            <Pressable onPress={handleLogout}>
                <View className="rounded-md bg-primary p-2 mb-4">
                <Text className="font-primary text-white">Uitloggen</Text>
                </View>
            </Pressable>
        </View>  
    );
}