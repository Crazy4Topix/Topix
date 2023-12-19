import React, { useState, useContext, useEffect } from 'react';
import { Pressable, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SupabaseUserSession } from '../contexts/user_session';
import { Icon } from 'react-native-elements';

  
export default function VoiceSelection() {
    const [voices, setVoices] = useState<Voice[] | null>(null);

    useEffect(() => {
    }, []);
  
  return (
    <View className={'flex-centering h-full w-full bg-white pb-4'}>
      <ScrollView className={'bg-white'}>
        <View className={'flex h-full w-full justify-center  pt-12'}>
          <Text className={'mx-8 pb-10 text-center font-primary_medium text-2xl'}>
            <Text>Kies de stem die jij wil horen</Text>
          </Text>
          <SafeAreaView className={'flex flex-row flex-wrap justify-center self-center'}>
            {voices?.map((voice) => {
              return (
                <Pressable
                  className={`${getBackgroundColor(
                    voice.state
                  )} flex h-20 w-5/12 justify-center rounded-lg`}
                  key={'topic-' + voices.display_name}
                  onPress={() => {
                    handlePress(voice);
                  }}
                >
                  <Text className={'text-center font-primary_medium'}>{voice.text}</Text>
                  <Pressable
                        onPress={() => {
                            handlePress(voice);
                        }}
                        >
                    <Icon name="volume_up" size={24} color="black" />
                    </Pressable>
                </Pressable>
              );
            })}
            
          </SafeAreaView>
        </View>
      </ScrollView>
      <View className='justify-center self-center pt-4'>
        <Pressable
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

