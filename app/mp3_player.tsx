import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import SoundPlayer from 'react-native-sound-player'

export default function Mp3Player() {
  const playAudio = async () => {
    // Set up the player
    try {
      SoundPlayer.playUrl('https://oeybruqyypqhrcxcgkbw.supabase.co/storage/v1/object/public/audio/sample/morgan.mp3')
    } catch (e) {
        console.log(`cannot play the sound file`, e)
    }
  };

  return (
    <View style={[styles.verticallySpaced, styles.mt20]}>
      <Pressable
        style={{ borderRadius: 10, backgroundColor: 'blue', padding: 10 }}
        onPress={playAudio as () => void}
      >
        <Text style={{ fontSize: 18, color: 'white' }}> Play</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})