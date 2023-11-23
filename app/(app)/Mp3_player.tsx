import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SupabaseUserSession } from '../../contexts/user_session'
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { supabase } from '../../lib/supabase';

const tracks = [
  {
//   get url using: "https://topix.site:8000/storage/v1/object/public/audio/podcasts/{userid}/{date}_{userid}.mp3"
    url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
    title: 'Morgan Freeman speech',
    artist: 'NU.nl',
    artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg',
  },
];

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);
  const [podcast, setPodcast] = useState({url: "", title: "", artist: "", artwork: ""});
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;


  useEffect(() => {
    getPodcast();
  },[]);

  useEffect(() =>{
    loadPodcastInAudioPlayer();
  },[podcast])


  async function getPodcast(){
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getDate())}-${padTo2Digits(date.getMonth() + 1)}-${date.getFullYear()}`;
    // TODO: fetch base link from server, don't hardcode it this way.
    const url = `https://topix.site:8000/storage/v1/object/public/audio/podcasts/${userId}/${currentDate}_${userId}.mp3`
    // TODO: come up with actual title and artist
    const title = "Dagelijkse podcast";

    const newPodcast = {
        url: url,
        title: title,
        artist: currentDate,
        artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg'
    }
    setPodcast(newPodcast);
  }

  async function loadPodcastInAudioPlayer(){
    try {
      // TODO: remove hardcoded url string
      await audioContext.setupAndAddPodcast('https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/podcasts/1/07-11-2023_1.mp3')
      // await audioContext.setupAndAddPodcast(podcast.url);
    } catch (error) {
      console.error('Error setting up and adding tracks:', error);
    }
  }

  function padTo2Digits(number:number){
    return number.toString().padStart(2, '0');
  }

    //TODO check if podcast is null, and use useEffect to change each time podcast changes.
  if(podcast.url == ""){
    return (
      <Text>Loading...</Text>
    )
  } else {
    return (
      <View className='flex-1 items-center justify-center bg-secondary'>
        <Image source={{ uri: podcast.artwork }} className='h-64 w-64' />
        <Text className='mt-8 font-bold text-20'>{podcast.title}</Text>
        <Text className='mt-4 text-20'>{podcast.artist}</Text>
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
