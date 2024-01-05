import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'
import { supabase } from '../../lib/supabase';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import { styled } from 'nativewind';
import { Redirect } from 'expo-router';
import { StringLiteral } from 'typescript';

interface Voice{
    id: string;
    name: String;
    display_name: string
}

const StyledDropdown = styled(Dropdown);


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
        navigation.goBack();
    };

    const navigateTopicSelection = () => {
        navigation.navigate('updateTopics');
    };

    const navigateVoiceSelection = () => {
        navigation.navigate('updateVoice')
    }

    useEffect(() => {
        const fetchFullName = async () => {
            if (!userId) return

            const name = await getFullName(userId);
            setFullName(name)
        };
        
        void fetchFullName();
    }, [userId]);

    if (fullName === null){
        ToastAndroid.show('Account is niet compleet, neem contact op met Crazy4.', ToastAndroid.LONG);
        return <Redirect href="/login" />;
    }
  
    return (
        <View className="flex-1 justify-center content-center bg-white px-20">
            <View className="absolute top-8 left-4 z-10">
                <Pressable onPress={handleGoBack}>
                    <Icon name="keyboard-return" size={36} color="black" />
                </Pressable>
            </View>
            <Text className="text-2xl font-semibold mb-4 text-center">Profiel Pagina</Text>

      {/* Display Name */}
      <Text className="mb-4 font-primary text-xl">{fullName}</Text>

      {/* Topic Selection Button */}
      <View className="mb-4 rounded-md bg-primary p-2">
        <Pressable onPress={navigateTopicSelection}>
          <Text className="font-primary text-white">Selecteer Topix</Text>
        </Pressable>
      </View>

        {/* Voice Selection */}
      <View className="mb-4 rounded-md bg-primary p-2">
        <Pressable onPress={navigateVoiceSelection}>
          <Text className="font-primary text-white">Selecteer stem</Text>
        </Pressable>
      </View>

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="rounded-md bg-primary p-2 mb-4">
          <Text className="font-primary text-white">Uitloggen</Text>
        </View>
      </Pressable>
    </View>
        
  );
}