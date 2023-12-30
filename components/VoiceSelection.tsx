import React, { useState, useContext, useEffect } from 'react';
import { Pressable, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SupabaseUserSession } from '../contexts/user_session';

interface Voice {
    id: string;
    name: string;
    display_name: string;
}

interface Navigation {
  navigationDest: string;
}

const VoiceSelection: React.FC<Navigation> = ({ navigationDest }) => {
    const [voices, setVoices] = useState<Voice[]>();
    const [selectedVoice, setSelectedVoice] = useState<Voice>();

    const navigation = useNavigation();
    const userContext = useContext(SupabaseUserSession); 
  
    useEffect(() => {
        void loadVoices();
    }, []);

    const getBackgroundColor = (voice: Voice): string => {
        return voice === selectedVoice ? 'bg-primary' : 'bg-gray-300'
    };

    const handleSubmit = async () => {
        const userId = userContext.session?.user.id;
        const rowToInsert = {
            user_id: userId,
            speaker_id: selectedVoice.id,
            length: 'normal',
        };

        const { data, error } = await supabase.from('audio_preferences').insert(rowToInsert).select();

        if (error !== null) {
        console.error(error);
        }

        // @ts-expect-error It complains about never but it is there
        navigation.navigate(navigationDest);
    };

    const loadVoices = async () => {
        const { data: voices, error: fetchVoicesError } = await supabase
            .from('speakers')
            .select('*')
            .eq('published', true);

        if (fetchVoicesError) {
            console.error('Error getting current topics:', fetchVoicesError);
            return;
        }
        if (!voices){
            return
        }
        setVoices(voices);
    };
    
    return (
        <View className={'flex-centering h-full w-full bg-white pb-4'}>
            <ScrollView className={'bg-white'}>
                <View className={'flex h-full w-full justify-center  pt-12'}>
                    <Text className={'mx-8 pb-10 text-center font-primary_medium text-2xl'}>
                        <Text>Kies de</Text>
                        <Text className={'font-primary_bold'}> stem </Text>
                        <Text>die jij het{'\n'}</Text>
                        <Text className={'font-primary_bold'}> mooist </Text>
                        <Text>vindt{'\n'}</Text>
                    </Text>
                    <SafeAreaView className={'flex flex-row flex-wrap justify-center gap-2 self-center'}>
                        {voices && (voices.map((voice) => {
                            return (
                                <Pressable
                                className={`${getBackgroundColor(voice)} flex h-20 w-5/12 justify-center rounded-lg`}
                                key={'voice-' + voice.name}
                                onPress={() => {
                                    setSelectedVoice(voice);
                                }}
                                >
                                <Text className={'text-center font-primary_medium'}>{voice.display_name}</Text>
                                </Pressable>
                            );
                        })
                    )}
                    </SafeAreaView>
                </View>
            </ScrollView>
            <View className='justify-center self-center pt-4'>
                <Pressable
                    disabled={!selectedVoice}
                    onPress={() => {
                        void handleSubmit();
                    }}
                    className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
                >
                    <Text className={'self-center font-primary_bold text-white'}>Bevestig</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default VoiceSelection;
