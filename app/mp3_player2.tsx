import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';

const tracks: Track[] = [
  {
    id: 'track1',
    url: require('./assets/audio/morgan.mp3'),
    title: 'Track 1',
    artist: 'Artist 1',
  },
];

const AudioPlayer: React.FC = () => {
  const playTrack = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(tracks);
      await TrackPlayer.play();
    } catch (e) {
      console.error('Error playing track:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Audio Player</Text>
      <Button title="Play Track" onPress={playTrack} />
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
