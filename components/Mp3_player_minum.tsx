import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../contexts/audio_player';

interface Props {
  test: string;
}
const AudioPlayerMinimal: React.FC<Props> = (props) => {
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

  useEffect(() => {}, [audioContext.audioState.isPlaying]);

  // Check if currentTrack is not null before rendering the player
  if (!audioContext.audioState.currentTrack) {
    return <></>; // Don't render anything if currentTrack is null
  }

  return (
    <View className="bg-secondary">
      <View className="flex-row">
        <Image source={{ uri: tracks[0].artwork }} className="ml-0 mr-4 h-16 w-16" />
        <View className="self-center">
          <Text className="mt-1 font-primary_bold text-white">{tracks[0].title}</Text>
          <Text className="-mt-1 font-primary text-white">{tracks[0].artist}</Text>
        </View>
        <View className="mx-2 flex-row self-center">
          <TouchableOpacity
            className="flex rounded-full"
            onPress={() => {
              audioContext.seekBackward();
            }}
          >
            <Icon name="skip-previous" size={40} color="white" />
          </TouchableOpacity>
          {audioContext.audioState && audioContext.audioState.isPlaying ? (
            <TouchableOpacity className="flex rounded-full" onPress={audioContext.pauseTrack}>
              <Icon name="pause-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity className="flex rounded-full" onPress={audioContext.resumeTrack}>
              <Icon name="play-circle-outline" size={40} color="#00DEAD" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="flex rounded-full"
            onPress={() => {
              audioContext.seekForward();
            }}
          >
            <Icon name="skip-next" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AudioPlayerMinimal;
