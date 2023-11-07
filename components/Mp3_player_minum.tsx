import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { Icon } from 'react-native-elements';
import { supabase } from '../lib/supabase';

const tracks = [
  {
    url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
    title: 'Morgan Freeman speech',
    artist: 'NU.nl',
    artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg',
  },
];

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioLink, setAudioLink] = useState(''); 

  const getDuration = () => {
    try {
      void SoundPlayer.getInfo().then((info) => {
        setDuration(info.duration);
      });
    } catch (error) {
      console.error('Error getting duration:', error);
    }
  };

  const resumeTrack = () => {
    try {
      SoundPlayer.play();
      setIsPlaying(true);
    } catch (e) {
      console.error('Error resuming track:', e);
    }
  };

  const pauseTrack = () => {
    try {
      SoundPlayer.pause();
      setIsPlaying(false);
    } catch (e) {
      console.error('Error pausing track:', e);
    }
  };

  const seekTo = (value: number) => {
    try {
      SoundPlayer.seek(value * duration);
    } catch (e) {
      console.error('Error seeking:', e);
    }
  };

  useEffect(() => {
    const setupAndAddTracks = async () => {
      try {
        // Fetch the audio link from Supabase
        const { data: audio, error } = await supabase
        .from('audio')
        .select('link')
        .single()
        if (error !== null) {
          console.error('Error fetching audio link:', error);
        } else if (audio !== null) {
          const audioUrl = audio.link;
          setAudioLink(audioUrl); // Set the audio link in the state

          // Load and play the audio using the extracted URL
          SoundPlayer.loadUrl(audioUrl);
          // SoundPlayer.play();
          getDuration();
          // setIsPlaying(true);
        }
      } catch (e) {
        console.error('Error setting up SoundPlayer:', e);
      };
    };

    void setupAndAddTracks();
  }, []);

  return (
    <View className=' bg-accent'>
      <View className='flex-row'>
        <Image source={{ uri: tracks[0].artwork }} className='h-16 w-16 ml-0 mr-4' />
        <View className='self-center'>
          <Text className='font-bold text-20'>{tracks[0].title}</Text>
          <Text className='text-20'>{tracks[0].artist}</Text>
        </View>
        <View className='flex-row self-center'>
          <TouchableOpacity className='flex rounded-full' onPress={() => { seekTo(0); }}>
            <Icon name="skip-previous" size={40} color="#00DEAD" />
          </TouchableOpacity>
          {isPlaying ? (
            <TouchableOpacity className='flex rounded-full' onPress={pauseTrack}>
              <Icon name="pause-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className='flex rounded-full' onPress={resumeTrack}>
              <Icon name="play-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          )}
          <TouchableOpacity className='flex rounded-full' onPress={() => { seekTo(0.5); }}>
            <Icon name="skip-next" size={40} color="#00DEAD" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayer;
