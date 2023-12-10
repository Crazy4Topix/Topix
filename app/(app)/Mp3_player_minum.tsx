import React, { useContext, useEffect, createContext } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { Link, router } from 'expo-router';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);

  useEffect(() => {
  }, [audioContext.audioState.isPlaying]);

  // Check if currentTrack is not null before rendering the player
  if ( !audioContext.audioState.currentTrack) {
    return null; // Don't render anything if currentTrack is null
  }

  const link = audioContext.audioState.currentTrack?.url
  const title = audioContext.audioState.currentTrack?.title
  const artist = audioContext.audioState.currentTrack?.artist
  const artwork = audioContext.audioState.currentTrack?.artwork

  return (
    <View className='bg-secondary'>
      <Pressable onPress={() => {router.push({pathname: '/Mp3_player', params: {audioLink: link, title: title, firstOpened: 'false'}})}}>
        <View className='flex-row'>
          <Image source={{ uri: artwork }} className='h-16 w-16 ml-0 mr-4' />
          <View className='self-center'>
            <Text className={'font-bold text-20 w-44'} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
            <Text className='text-20'>{artist}</Text>
          </View>
          <View className='flex-row self-center'>
            <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekBackward(); }}>
              <Icon name="skip-previous" size={40} color="#00DEAD" />
            </TouchableOpacity>
            {audioContext.audioState && audioContext.audioState.isPlaying ? (
              <TouchableOpacity className='flex rounded-full' onPress={audioContext.pauseTrack}>
                <Icon name="pause-circle-outline" size={40} color="#00DEAD" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className='flex rounded-full' onPress={audioContext.resumeTrack}>
                <Icon name="play-circle-outline" size={40} color="#00DEAD" />
              </TouchableOpacity>
            )}
            <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekForward(); }}>
              <Icon name="skip-next" size={40} color="#00DEAD" />
            </TouchableOpacity>
          </View>
        </View> 
      </Pressable>
    </View>
  );
};

export default AudioPlayer;
