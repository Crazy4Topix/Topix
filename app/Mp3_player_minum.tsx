import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../contexts/audio_player';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);

  const tracks = [
    {
      url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
      title: 'Morgan Freeman speech',
      artist: 'NU.nl',
      artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg',
      duration: 0, // You should provide the actual duration here
    },
  ];

  useEffect(() => {
    // You can update the track's duration when it's available in the context
    const currentTrack = audioContext.audioState.currentTrack;
    if (currentTrack) {
      tracks[0].duration = currentTrack.duration;
    }
  }, [audioContext.audioState.currentTrack]);

  // Check if currentTrack is not null before rendering the player
  // if (!audioContext.audioState.currentTrack) {
  //   return null; // Don't render anything if currentTrack is null
  // }

  return (
    <View className=' bg-accent'>
      <View className='flex-row'>
        <Image source={{ uri: tracks[0].artwork }} className='h-16 w-16 ml-0 mr-4' />
        <View className='self-center'>
          <Text className='font-bold text-20'>{tracks[0].title}</Text>
          <Text className='text-20'>{tracks[0].artist}</Text>
        </View>
        <View className='flex-row self-center'>
          <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekTo(0); }}>
            <Icon name="skip-previous" size={40} color="#00DEAD" />
          </TouchableOpacity>
          {audioContext.audioState.isPlaying ? (
            <TouchableOpacity className='flex rounded-full' onPress={audioContext.pauseTrack}>
              <Icon name="pause-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className='flex rounded-full' onPress={audioContext.resumeTrack}>
              <Icon name="play-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          )}
          <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekTo(0.5); }}>
            <Icon name="skip-next" size={40} color="#00DEAD" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
