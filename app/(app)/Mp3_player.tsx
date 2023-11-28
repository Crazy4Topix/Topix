import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { useLocalSearchParams } from 'expo-router';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);
  const [audio, setAudio] = useState({url: "", title: "", artist: "", artwork: ""});
  let {audioLink, title} = useLocalSearchParams<{audioLink?: string; title?: string}>()

  useEffect(() => {
    getAudio();
  },[]);

  useEffect(() =>{
      loadAudioInPlayer();
  },[audio])

  async function getAudio(){
    let url, audioTitle;
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getDate())}-${padTo2Digits(date.getMonth() + 1)}-${date.getFullYear()}`;
    //TODO remove replacements.
    audioLink = audioLink?.replace("http://127.0.0.1:8000", "https://topix.site");
    audioLink = audioLink?.replace("?","");
    if(audioLink){
      url = audioLink;
    } else{
      console.error("audiolink undefined");
      return;
    }
    if(title){
      audioTitle = title
    } else {
      audioTitle ="";
      console.error("title undefined");
    }
    // TODO: get an artwork for the player

    const newAudio = {
        url: url,
        title: audioTitle,
        artist: currentDate,
        artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg'
    }
    if(newAudio.url === audio.url) return;
    setAudio(newAudio);
  }

  async function loadAudioInPlayer(){
    if(audio.url === "") return;
    try {
      await audioContext.setupAndAddPodcast(audio.url);
    } catch (error) {
      console.error('Error setting up and adding tracks:', error);
    }
  }

  function padTo2Digits(number:number){
    return number.toString().padStart(2, '0');
  }

  if(audio.url === ""){
    return (
      <View className='flex-1 items-center justify-center bg-secondary'>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View className='flex-1 items-center justify-center bg-secondary'>
        <Image source={{ uri: audio.artwork }} className='h-64 w-64' />
        <Text className='mt-8 font-bold text-20'>{audio.title}</Text>
        <Text className='mt-4 text-20'>{audio.artist}</Text>
        <View className='flex-row m-10'>
          <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekBackward(); }}>
            <Icon name="skip-previous" size={70} color="#00DEAD" />
          </TouchableOpacity>
          {audioContext.audioState && audioContext.audioState.isPlaying ? (
            <TouchableOpacity className='flex rounded-full' onPress={audioContext.pauseTrack}>
              <Icon name="pause-circle-outline" size={70} color="#00DEAD" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className='flex rounded-full' onPress={audioContext.resumeTrack}>
              <Icon name="play-circle-outline" size={70} color="#00DEAD" />
            </TouchableOpacity>
          )}
          <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekForward(); }}>
            <Icon name="skip-next" size={70} color="#00DEAD" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }   
};

export default AudioPlayer;
