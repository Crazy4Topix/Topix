import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Icon } from 'react-native-elements';
import { Seekbar } from 'react-seekbar'

const tracks = [
  {
    id: 'track1',
    url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
    title: 'Morgan Freeman speech',
    artist: 'NU.nl',
    artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg',
  },
];

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleSeek = async () => {
    try {
      const progress = await TrackPlayer.getProgress();
      console.log(progress);
      setPosition(progress.duration - progress.position);
    } catch (error) {
      console.error('Error while seeking:', error);
    }
  };

  const getDuration = async () => {
    const progress = await TrackPlayer.getProgress();
    console.log(progress.duration)
    setDuration(progress.duration);
  }

  const resumeTrack = async () => {
    try {
      await TrackPlayer.play();
      setIsPlaying(true);
    } catch (e) {
      console.error('Error resuming track:', e);
    }
  };

  const pauseTrack = async () => {
    try {
      await TrackPlayer.pause();
      setIsPlaying(false);
      await handleSeek()
    } catch (e) {
      console.error('Error pausing track:', e);
    }
  };

  useEffect(() => {
    const setupAndAddTracks = async () => {
      try {
        await TrackPlayer.setupPlayer();
        await TrackPlayer.reset();
        await TrackPlayer.add(tracks);
        await TrackPlayer.play();
        await getDuration();
        setIsPlaying(true);
      } catch (e) {
        console.error('Error setting up TrackPlayer:', e);
      }
    };

    void setupAndAddTracks();
  }, []);

  return (
    <View className='flex-1 items-center justify-center bg-accent'>
      <Image source={{ uri: tracks[0].artwork }} className='h-64 w-64' />
      <Text className='mt-8 font-bold text-20'>{tracks[0].title}</Text>
      <Text className='mt-4 text-20'>{tracks[0].artist}</Text>
      {/* <Seekbar /> */}
      <View className='flex-row m-10'>
        <TouchableOpacity className='flex rounded-full' onPress={() => {pauseTrack().catch(e => {console.log(e)})}}>
          <Icon name="skip-previous" size={70} color="#00DEAD" />
        </TouchableOpacity>
        {isPlaying ? (
          <TouchableOpacity className='flex rounded-full' onPress={() => {pauseTrack().catch(e => {console.log(e)})}}>
            <Icon name="pause-circle-outline" size={70} color="#00DEAD" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity className='flex rounded-full' onPress={() => {resumeTrack().catch(e => {console.log(e)})}}>
            <Icon name="play-circle-outline" size={70} color="#00DEAD" />
          </TouchableOpacity>
        )}
        <TouchableOpacity className='flex rounded-full' onPress={() => {pauseTrack().catch(e => {console.log(e)})}}>
          <Icon name="skip-next" size={70} color="#00DEAD" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;
