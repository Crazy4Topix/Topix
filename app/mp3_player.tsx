import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';

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
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const handleSeek = () => {
    try {
      void SoundPlayer.getInfo().then((info) => {
        setPosition(info.duration - info.currentTime);
        setSliderValue(info.currentTime / info.duration);
      });
    } catch (error) {
      console.error('Error while seeking:', error);
    }
  };

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
      handleSeek();
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
        SoundPlayer.loadUrl(tracks[0].url);
        SoundPlayer.play();
        getDuration();
        setIsPlaying(true);
      } catch (e) {
        console.error('Error setting up SoundPlayer:', e);
      };
    };

    void setupAndAddTracks();
  }, []);

  return (
    <View className='flex-1 items-center justify-center bg-accent'>
      <Image source={{ uri: tracks[0].artwork }} className='h-64 w-64' />
      <Text className='mt-8 font-bold text-20'>{tracks[0].title}</Text>
      <Text className='mt-4 text-20'>{tracks[0].artist}</Text>
      {/* <Slider 
        className='flex' 
        value={sliderValue} 
        onValueChange={(value) => { setSliderValue(value); }} 
        onSlidingComplete={(value) => { seekTo(value); }}
      /> */}
      <Slider
  style={{width: 200, height: 40}}
  minimumValue={0}
  maximumValue={1}
  minimumTrackTintColor="#FFFFFF"
  maximumTrackTintColor="#000000"
/>
      <View className='flex-row m-10'>
        <TouchableOpacity className='flex rounded-full' onPress={pauseTrack}>
          <Icon name="skip-previous" size={70} color="#00DEAD" />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity className='flex rounded-full' onPress={pauseTrack}>
            <Icon name="pause-circle-outline" size={70} color="#00DEAD" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className='flex rounded-full' onPress={resumeTrack}>
            <Icon name="play-circle-outline" size={70} color="#00DEAD" />
          </TouchableOpacity>
        )}
        <TouchableOpacity className='flex rounded-full' onPress={pauseTrack}>
          <Icon name="skip-next" size={70} color="#00DEAD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;
