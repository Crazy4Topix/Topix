import React, { useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../contexts/audio_player';

const AudioPlayerMinimal: React.FC = () => {
  const audioContext = useContext(AudioPlayerContext);

  useEffect(() => {}, [audioContext.audioState.isPlaying]);

  // Check if currentTrack is not null before rendering the player
  if (!audioContext.audioState.currentTrack) {
    return <></>; // Don't render anything if currentTrack is null
  }
  const thumbnail =
    audioContext.podcastInfo.length > 0 &&
    audioContext.podcastInfo[0].thumbnail &&
    audioContext.podcastInfo[0].thumbnail !== ''
      ? { uri: audioContext.podcastInfo[0].thumbnail }
      : require('../assets/images/Topix_wit.png');

  return (
    <View className="bg-background py-1">
      <View className="flex-row">
        <Image source={thumbnail} className="ml-0 mr-4 h-16 w-16" />
        <View className="self-center">
          <Text
            className={'text-20 w-44 font-primary_bold text-white'}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {audioContext.audioState.currentTrack.title}
          </Text>
          <Text className="text-20 font-primary text-white">
            {audioContext.audioState.currentTrack.artist}
          </Text>
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
