import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'
import { Icon } from 'react-native-elements';

export default function ProfilePage() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const userContext = useContext(SupabaseUserSession);
    const userId = userContext.session?.user.id; 
    
    const handleLogout = async () => {
        try {
            await signOut();
            navigation.navigate('welcome');
        } catch (e) {
            console.error('Error logging out:', e.message);
        }
    };

    const handleGoBack = () => {
        navigation.goBack(); // Go back to the previous screen
    };

    const navigateTopicSelection = () => {
        navigation.navigate('updateTopics');
    };

    useEffect(() => {
        const fetchFullName = async () => {
            try {
                if (userId) { // Check if userId is defined
                    const name = await getFullName(userId);
                    if (name !== null) {
                        setFullName(name);
                    } else {
                        console.error('Error fetching full name.');
                    }
                }
            } catch (error) {
                console.error('Error fetching full name:', error.message);
            }
        };

        void fetchFullName();
    }, [userId]);

    return (
        <View className="flex-1 justify-center items-center bg-white">
            <View className="absolute top-8 left-4 z-10">
                <Pressable onPress={handleGoBack}>
                    <Icon name="keyboard-return" size={36} color="black" />
                </Pressable>
            </View>
            <Text className="text-2xl font-semibold mb-4">Profiel Pagina</Text>

            {/* Display Name */}
            <Text className="text-xl mb-2">{fullName}</Text>

            {/* Topic Selection Button */}
            <View className="bg-primary p-2 rounded-md mb-4">
                <Pressable onPress={navigateTopicSelection}>
                    <Text className="text-white">Selecteer Topix</Text>
                </Pressable>
            </View>

            {/* Logout Button */}
            <Pressable onPress={handleLogout}>
                <View className="bg-primary p-2 rounded-md">
                    <Text className="text-white">Uitloggen</Text>
                </View>
            </Pressable>
        </View>
    );
}
