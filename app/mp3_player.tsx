import React, {useEffect} from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import TrackPlayer, { type Track }from 'react-native-track-player';
// import { Capability } from 'react-native-track-player';


const tracks: Track[] = [
  {
    id: 'track1',
    url: 'https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3',
    title: 'Track 1',
    artist: 'Artist 1',
  },
];

  

const AudioPlayer: React.FC = () => {
  const playTrack = async () => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);
      console.log("added tracks");
      await TrackPlayer.play();
      console.log("playing")
    } catch (e) {
      console.error('Error playing track:', e);
    }
  };

  const pauseTrack = async () => {
    try {
      await TrackPlayer.pause();
    } catch (e) {
      console.error('Error pausing track:', e);
    }
  };

  useEffect(() => {
    const setupAndAddTracks = async () => {
      try {
        await TrackPlayer.setupPlayer();
        console.log("setup finished");
      } catch (e) {
        console.error('Error setting up trackplayer:', e);
      }
    };
  
    void setupAndAddTracks();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Audio Player</Text>
      <Button title="Play Track" onPress={() => {playTrack().catch(e => {console.log(e)})}} />
      <Button title="Pause Track" onPress={() => {pauseTrack().catch(e => {console.log(e)})}} />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AudioPlayer;
