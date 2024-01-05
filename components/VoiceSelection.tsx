import React, { useState, useContext, useEffect } from 'react';
import { Pressable, SafeAreaView, View, Text, ScrollView, ToastAndroid } from 'react-native';
import { useNavigation } from 'expo-router';
import { getSampleBySpeakerId, supabase } from '../lib/supabase';
import { SupabaseUserSession } from '../contexts/user_session';
import { AudioPlayerContext } from '../contexts/audio_player';

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
    const [isSignup, setIsSignup] = useState<boolean>(true);

    const navigation = useNavigation();
    const userContext = useContext(SupabaseUserSession); 
    const userId = userContext.session?.user.id;
    const audioContext = useContext(AudioPlayerContext);
  
    useEffect(() => {
        void loadVoices();
        if (navigationDest === "profile"){
            setIsSignup(false)
        }
    }, []);

    useEffect(() => {
        if(!isSignup){
            getCurrentSelectedVoice();
        }
    }, [isSignup, voices])

    const getCurrentSelectedVoice = async () => {
        const{data: speaker, error} = await supabase
            .from('audio_preferences')
            .select('speaker_id')
            .eq('user_id', userId)
            .single()

        if(error !== null){
            console.error(`failed to get current voice ${error}`)
            return
        }
        const currentVoice = voices?.find(voice => voice.id === speaker.speaker_id)
        setSelectedVoice(currentVoice)
    }

    const getBackgroundColor = (voice: Voice): string => {
        return voice === selectedVoice ? 'bg-primary' : 'bg-gray-300'
    };

    const handleSubmit = async () => {
        if(!selectedVoice){
            ToastAndroid.show("Please select a voice before proceeding", ToastAndroid.LONG)
            return
        }
        const rowToInsert = {
            user_id: userId,
            speaker_id: selectedVoice.id,
            length: 'normal',
        };

        if(isSignup){
            const { data, error} = await supabase.from('audio_preferences').insert(rowToInsert).select();
            if (error !== null) {
                console.error(error);
                return
            }
        } else {
            const { data, error } = await supabase
                .from('audio_preferences')
                .update(rowToInsert)
                .eq("user_id", userId)
                .select();
            if (error !== null) {
                console.error(error);
                return
            }
            ToastAndroid.show(`Morgen staat er een nieuwe podcast voor je klaar met ${selectedVoice.display_name}!`, ToastAndroid.LONG)
        }
        audioContext.pauseTrack()
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

    const playSample = async (speaker: Voice) =>{
        const sampleUrl = await getSampleBySpeakerId(speaker.id);
        if (!sampleUrl) {
            ToastAndroid.show("Sample could not be loaded", ToastAndroid.LONG)
            return
        }
        await audioContext.setupAndAddAudio(sampleUrl, 'Sample', speaker.display_name);
    }
    
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
                                    playSample(voice)
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
