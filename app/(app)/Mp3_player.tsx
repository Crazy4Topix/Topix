import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { supabase } from '../../lib/supabase';

const tracks = [
  {
    url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
    title: 'Morgan Freeman speech',
    artist: 'NU.nl',
    artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg',
  },
];

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);

  useEffect(() => {
    void (async () => {
      try {
        await audioContext.setupAndAddTracks();
      } catch (error) {
        console.error('Error setting up and adding tracks:', error);
      }
    })();
  }, []);

  useEffect(() => {
    // You can update the track's duration when it's available in the context
    
  }, [audioContext.audioState.isPlaying]);

  return (
    <View className='flex-1 items-center justify-center bg-accent'>
      <Image source={{ uri: tracks[0].artwork }} className='h-64 w-64' />
      <Text className='mt-8 font-bold text-20'>{tracks[0].title}</Text>
      <Text className='mt-4 text-20'>{tracks[0].artist}</Text>
      <View className='flex-row m-10'>
        <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekTo(0); }}>
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
        <TouchableOpacity className='flex rounded-full' onPress={() => { audioContext.seekTo(0.5); }}>
          <Icon name="skip-next" size={70} color="#00DEAD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;
