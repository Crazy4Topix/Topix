import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ToastAndroid} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'
import { supabase } from '../../lib/supabase';
import { Icon } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import { styled } from 'nativewind';
import { Redirect } from 'expo-router';

const StyledDropdown = styled(Dropdown);


export default function ProfilePage() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const userContext = useContext(SupabaseUserSession);
    const userId = userContext.session?.user.id; 
    const [voices, setVoices] = useState<Voice[] | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

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

    const fetchSpeakersName = async () => {
    try {
        const { data: speakers, error } = await supabase
        .from('speakers')
        .select('display_name, id, name');
        if (error != null) {
            console.error(error);
        }
        setVoices(speakers as Voice[] | null);

        
        let { data: cur_voice, errorCur } = await supabase
        .from('audio_preferences')
        .select('speaker_id')
        .eq("user_id", userId)

        if(!cur_voice){
            return;
        }

        if (cur_voice.length > 0) {
            const speakerId = cur_voice[0].speaker_id;
    
            // Find the corresponding speaker in the speakers data
            const selectedSpeaker = speakers.find(speaker => speaker.id === speakerId);
    
            if (selectedSpeaker) {
                // Access the display_name of the selected speaker
                const speakerName = selectedSpeaker.display_name;
                setSelectedValue(speakerName)
            } else {
                console.error('Speaker not found for the given speaker_id.');
            }
        } else {
            console.error('No speaker_id found for the user.');
        }
    } catch (error) {
        console.error('Error fetching speakers:', error.message);
    }
    };

    const handleVoiceSelection = async (value: string | null) => {
        setSelectedValue(value);
        const selectedVoice = voices ? voices.find(voice => voice.id === value)?.id : null;
        
        let { data: audio_preferences, error: userNotExistError } = await supabase
            .from('audio_preferences')
            .select('user_id')
            .eq('user_id', userId)
        if(userNotExistError || !audio_preferences){
            const { data, error } = await supabase
            .from('audio_preferences')
            .insert({ user_id: userId, speaker_id: selectedVoice, length: "normal"})
            .select()
            if(error){
                console.error(error)
            }
        } else {
            const { data, error } = await supabase
                .from('audio_preferences')
                .update({ speaker_id: selectedVoice })
                .eq('user_id', userId)
                .select()
            if(error){
                console.error(error)
            }
        }
      };

    useEffect(() => {
        const fetchFullName = async () => {
            if (!userId) return

            const name = await getFullName(userId);
            setFullName(name)
        };
        
        void fetchFullName();
        void fetchSpeakersName();
    }, [userId]);

    if (!voices || voices === null) {
        return null; // or a loading component if you prefer
      }

    const data = voices.map(voice => ({ label: voice.display_name, value: voice.id }))

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

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="rounded-md bg-primary p-2 mb-4">
          <Text className="font-primary text-white">Uitloggen</Text>
        </View>
      </Pressable>

        {/* Voice Selection */}
        <View className='mb-4 rounded-md bg-primary px-2 py-1'>
            <StyledDropdown
            className='bg-primary font-primary text-white'
            selectedTextStyle={styles.TextStyle}
            placeholderStyle={styles.TextStyle}
            data={data}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? (selectedValue ?? 'Selecteer stem') : '...'}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
                setValue(item.value);
                setIsFocus(false);
                handleVoiceSelection(item.value);
            }}
            renderLeftIcon={() => (
                <View className='pr-2'>
                    <Icon name="record-voice-over" size={24} color="white" />
                </View>
            )}
            />
        </View>
    </View>
        
  );
}

const styles = StyleSheet.create({
    TextStyle: {
      color: 'white'
    }
  });