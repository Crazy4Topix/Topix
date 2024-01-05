import React, { type FunctionComponent, useContext, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Icon } from '@rneui/themed';
import { styled } from 'nativewind';
import { cloneVoice, voiceClone } from '../../../lib/voiceClone';
import { Audio } from 'expo-av';
import { SupabaseUserSession } from '../../../contexts/user_session';
import { useNavigation } from '@react-navigation/native';


const ScrollTextSection = (maxLineLength: number) => {
  const res = [];

  const words = voiceClone.split(' ');

  let line = "";
  for (let i = 0; i < words.length; i++) {
    if (line.length >= maxLineLength) {
      res.push(<Text key={i} className={"text-black text-xl text-center font-primary_bold my-1"}>{line}</Text>);
      line = "";
    }

    line += (words[i]) + " ";
  }

  return res;
}

const CreateVoiceClone: FunctionComponent = () => {
  // @ts-expect-error: mismatch of types
  const StyledIcon = styled(Icon);
  const [recording, setRecording] = useState<null | Audio.Recording>(null);
  const userContext = useContext(SupabaseUserSession);

  const navigation = useNavigation();

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');

    if(!recording){
      return;
    }

    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync(
      {
        allowsRecordingIOS: false,
      }
    );

    if(!userContext.session){
      console.error("User not logged in");
      return;
    }

    const resp = await cloneVoice(recording, userContext.session.user?.id , userContext.session);

    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);


    // @ts-expect-error: route is there
    navigation.navigate('Sample', { error: (resp.status !== 200).toString()});
  }

  return (
    <View className={'h-full'}>
      <ScrollView className={'pt-10'}>
        {ScrollTextSection(25)}
      </ScrollView>
      <View className={"flex h-32 justify-center"}>
        {recording ? (
          <Pressable className={'w-16 h-16 rounded-full bg-primary flex justify-center self-center'} onPress={() => {void stopRecording();}}>
            <StyledIcon name={'stop'} className={'self-center'} color={'white'} size={45}/>
          </Pressable>
          ) : (
        <Pressable className={'w-16 h-16 rounded-full bg-accent flex justify-center self-center'} onPress={() => {void startRecording();}}>
          <StyledIcon name={'mic'} className={'self-center'} color={'white'} size={45}/>
        </Pressable>
          )}
      </View>
    </View>
  );
};

export default CreateVoiceClone;
