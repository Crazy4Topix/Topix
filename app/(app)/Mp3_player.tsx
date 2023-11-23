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
    console.log("got podcast");
  },[]);

  useEffect(() =>{
    loadPodcastInAudioPlayer();
},[podcast])

  useEffect(() => {
    // You can update the track's duration when it's available in the context
    
  }, [audioContext.audioState.isPlaying]);

  async function getPodcast(){
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getDate())}-${padTo2Digits(date.getMonth() + 1)}-${date.getFullYear()}`;
    const url = `https://topix.site:8000/storage/v1/object/public/audio/podcasts/${userId}/${currentDate}_${userId}.mp3`
    // TODO: come up with title and artist
    const title = "Dagelijkse podcast";

    const newPodcast = {
        url: url,
        title: title,
        artist: currentDate,
        artwork: 'https://cdn.britannica.com/40/144440-050-DA828627/Morgan-Freeman.jpg'
    }
    console.log(`new podcastartist: ${newPodcast.artist}`);
    setPodcast(newPodcast);
    console.log(`artist: ${podcast.artist}`);
    console.log(`after set podcast: ${podcast}`);
  }

  async function loadPodcastInAudioPlayer(){
    console.log("in load podcast");
    try {
      await audioContext.setupAndAddTracks();
      console.log("done setting up audio track");
    } catch (error) {
      console.error('Error setting up and adding tracks:', error);
    }
    console.log("at end of load podcast");

  }

  function padTo2Digits(number:number){
    return number.toString().padStart(2, '0');
  }

    //TODO check if podcast is null, and use useEffect to change each time podcast changes.
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
};

export default AudioPlayer;
