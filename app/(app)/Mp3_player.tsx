import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { router, useNavigation } from 'expo-router';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);

  const [currTime, setCurrTime] = useState(0);

  useEffect(() => {
    if (audioContext.audioState.currentTrack == null) return;
    if (audioContext.audioState.isPlaying) {
      const interval = setInterval(() => {
        void audioContext.getTime().then((time) => {
          setCurrTime(time);
        });
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [audioContext]);

  const navigation = useNavigation();

  if (audioContext.podcastInfo == null) {
    console.error('podcastInfo undefined');
    return;
  }

  const currentPodcastInfo = (currTimestamp: number) => {
    for (let i = 0; i < audioContext.podcastInfo.length; i++) {
      if (
        currTimestamp >= audioContext.podcastInfo[i].timestamp &&
        (i === audioContext.podcastInfo.length - 1 ||
          currTimestamp < audioContext.podcastInfo[i + 1].timestamp)
      ) {
        const thumbnail =
          audioContext.podcastInfo[i].thumbnail !== ''
            ? { uri: audioContext.podcastInfo[i].thumbnail }
            : require('../../assets/images/Topix_zwart.png');
        return (
          <>
            <Image source={thumbnail} className="h-64 w-64" />
            <Text className="mt-8  text-center font-primary_bold text-2xl text-white">
              {audioContext.podcastInfo[i].news}
            </Text>
            {audioContext.podcastInfo[i].source === '' ? (
              <Text className="text-20 mt-4 font-primary text-xl text-primary">Welkom</Text>
            ) : (
              <Text
                className="text-20 mt-4 font-primary text-xl text-primary underline"
                onPress={() => {
                  void Linking.openURL(audioContext.podcastInfo[i].source);
                }}
              >
                Lees het orginele artikel
              </Text>
            )}
          </>
        );
      }
    }
  };

  return (
    <>
      <View className={'absolute left-0 top-0 z-10 w-full'}>
        <Pressable
          className={'mt-10 flex w-full'}
          onPress={() => {
            router.back();

            if (router.canGoBack()) {
              router.back();
            } else {
              // @ts-expect-error It complains about never but it is there
              navigation.navigate('index', { screen: 'index' });
            }
          }}
        >
          <Icon name={'expand-more'} color={'white'} size={52} className={'mx-2 self-start'} />
        </Pressable>
      </View>
      {!audioContext.audioState.currentTrack || audioContext.audioState.currentTrack.url === '' ? (
        <View className="flex-1 items-center justify-center bg-secondary  ">
          <Text className={"font-primary_bold text-2xl text-white"}>Loading...</Text>
        </View>
      ) : (
        <>
          <View className="flex-1 items-center justify-center bg-background px-2">
            {currentPodcastInfo(currTime)}
            <View className="m-10 flex-row">
              <TouchableOpacity
                className="flex rounded-full"
                onPress={() => {
                  audioContext.seekBackward();
                }}
              >
                <Icon name="skip-previous" size={70} color="#00DEAD" />
              </TouchableOpacity>
              {audioContext.audioState && audioContext.audioState.isPlaying ? (
                <TouchableOpacity className="flex rounded-full" onPress={audioContext.pauseTrack}>
                  <Icon name="pause-circle-outline" size={70} color="#00DEAD" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity className="flex rounded-full" onPress={audioContext.resumeTrack}>
                  <Icon name="play-circle-outline" size={70} color="#00DEAD" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                className="flex rounded-full"
                onPress={() => {
                  audioContext.seekForward();
                }}
              >
                <Icon name="skip-next" size={70} color="#00DEAD" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default AudioPlayer;
