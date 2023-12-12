import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session'
import { supabase } from '../../lib/supabase';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ProfilePage() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const userContext = useContext(SupabaseUserSession);
    const userId = userContext.session?.user.id; 
    const [voices, setVoices] = useState<Voice[] | null>(null);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [isDropdownFocus, setIsDropdownFocus] = useState(false);
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

    const navigateVoiceSelection = () => {
        navigation.navigate('voiceSelection');
    };

    const fetchSpeakersName = async () => {
    try {
        const { data: speakers, error } = await supabase
        .from('speakers')
        .select('display_name, id, name');
        if (error != null) {
        console.log(error);
        }
        setVoices(speakers as Voice[] | null);

        
        let { data: cur_voice, errorCur } = await supabase
        .from('audio_preferences')
        .select('speaker_id')
        .eq("user_id", userId)

        console.log(cur_voice)

        if (cur_voice.length > 0) {
            const speakerId = cur_voice[0].speaker_id;
    
            // Find the corresponding speaker in the speakers data
            const selectedSpeaker = speakers.find(speaker => speaker.id === speakerId);
    
            if (selectedSpeaker) {
                // Access the display_name of the selected speaker
                const speakerName = selectedSpeaker.display_name;
                setSelectedValue(speakerName)
            } else {
                console.log('Speaker not found for the given speaker_id.');
            }
        } else {
            console.log('No speaker_id found for the user.');
        }
    } catch (error) {
        console.error('Error fetching speakers:', error.message);
    }
    };

    const handleVoiceSelection = async (value: string | null) => {
        setSelectedValue(value);
        // Access the selected voice using voices.find(voice => voice.id === value)
        const selectedVoice = voices ? voices.find(voice => voice.id === value)?.id : null;
        // Do something with the selected voice...
        console.log(selectedVoice)

        const { data, error } = await supabase
        .from('audio_preferences')
        .update({ speaker_id: selectedVoice })
        .eq('user_id', userId)
        .select()
        console.log(data)
        console.log(error)

      };

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
            } catch (error) {
                console.error('Error fetching full name:', error.message);
            }
        };
        
        void fetchFullName();
        void fetchSpeakersName();
    }, [userId]);

    if (!voices || voices === null) {
        return null; // or a loading component if you prefer
      }

    const data = voices.map(voice => ({ label: voice.display_name, value: voice.id }))
    console.log(selectedValue)
  
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

            {/* Voice Selection Button */}
            <View className="bg-primary p-2 rounded-md mb-4">
                <Pressable onPress={navigateVoiceSelection}>
                    <Text className="text-white">Selecteer Stem</Text>
                </Pressable>
            </View>

      {/* Logout Button */}
      <Pressable onPress={handleLogout}>
        <View className="rounded-md bg-primary p-2 mb-4">
          <Text className="font-primary text-white">Uitloggen</Text>
        </View>
      </Pressable>

            {/* Voice Selection */}
            <View className='bg-white'>
                <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? (selectedValue ?? 'Select item') : '...'}
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
    container: {
      backgroundColor: 'white',
      paddingTop: 12,
    },
    dropdown: {
      height: 40,
      borderColor: 'white',
      backgroundColor: '#00DEAD',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
      color: 'white'
    },
    selectedTextStyle: {
      fontSize: 16,
      color: 'white'
      
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });