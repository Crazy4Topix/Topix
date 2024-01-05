import React, { type FunctionComponent, useContext, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Icon } from '@rneui/themed';
import { getSample } from '../../../lib/supabase';
import { AudioPlayerContext } from '../../../contexts/audio_player';
import { SupabaseUserSession } from '../../../contexts/user_session';
import { useNavigation } from '@react-navigation/native';

const Sample: FunctionComponent = () => {

  const [sampleUrl, setSampleUrl] = React.useState<string | null>(null);
  const { session } = useContext(SupabaseUserSession);

  const audioContext = useContext(AudioPlayerContext);
  const navigation = useNavigation();



  useEffect(() => {
    if(session == null) return;

    void getSample(session.user.id).then((url) => {
      setSampleUrl(url);
    });
  }, [session]);


  return (<View className={'h-full w-full flex'}>
      <View className={"flex justify-evenly h-full"}>
        <Text className={'px-5 text-black text-3xl text-left font-primary_bold my-1 '}>
          Gelukt! Luister hier naar het resultaat
        </Text>
        {sampleUrl ?
          <>
            <Pressable
              className={'mt-10 flex w-full'}
              onPress={() => {
                void audioContext.setupAndAddAudio(sampleUrl, 'Sample', 'Sample');
              }}
            >
              <Icon name={'play-circle-outline'} color="#00DEAD" size={90} className={'mx-2 self-start'}  />
            </Pressable>
            <Pressable onPress={ () => {
              navigation.goBack();
            }} className={'w-32 h-16 rounded-full bg-primary flex justify-center self-center'}>
              <Text className={"text-center text-white text-lg font-primary_bold"}>Terug</Text>
            </Pressable>
          </>
          :
          <Text className={'px-5 text-black text-3xl text-left font-primary_bold my-1 '}>
            Sample aan het laden...
          </Text>
        }
      </View>
  </View>);
};

export default Sample;
