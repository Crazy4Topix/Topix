import React, { type FunctionComponent, useState } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { styled } from 'nativewind';
import {testScript} from '../../lib/testScript';
import { Audio } from 'expo-av';


const ScrollTextSection = (maxLineLength: number) => {
  const res = [];

  const words = testScript.split(' ');

  let line = "";
  for (let i = 0; i < words.length; i++) {
    if (line.length >= maxLineLength) {
      res.push(<Text className={"text-black text-xl text-center font-primary_bold my-1"}>{line}</Text>);
      line = "";
    }

    line += (words[i]) + " ";
  }

  return res;
}

const createVoiceClone: FunctionComponent = () => {
  const StyledIcon = styled(Icon);
  const [recording, setRecording] = useState<null | Audio.Recording>(null);

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
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
  }

  return (
    <View className={'h-full'}>
      <ScrollView className={'pt-10'}>
        {ScrollTextSection(25)}
      </ScrollView>
      <View className={"flex h-32 justify-center"}>
        {isRecording ? (
          <Pressable className={'w-16 h-16 rounded-full bg-primary flex justify-center self-center'} onPress={() => {void onStopRecord();}}>
            <StyledIcon name={'stop'} className={'self-center'} color={'white'} size={45}/>
          </Pressable>
          ) : (
        <Pressable className={'w-16 h-16 rounded-full bg-accent flex justify-center self-center'} onPress={() => {void onStartRecord();}}>
          <StyledIcon name={'mic'} className={'self-center'} color={'white'} size={45}/>
        </Pressable>
          )}
      </View>
    </View>
  );
};

export default createVoiceClone;
