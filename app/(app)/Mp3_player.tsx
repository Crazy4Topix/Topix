import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { type PodcastInfo } from '../../types/podcast_info';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);
  const [audio, setAudio] = useState({ url: '', title: '', artist: '', artwork: '' });
  const { audioLink, title, podcastInfoStr } = useLocalSearchParams<{
    audioLink?: string;
    title?: string;
    podcastInfoStr?: string;
  }>();

  useEffect(() => {
    void getAudio();
  }, []);

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

  useEffect(() => {
    if (audio.url === '') {
      return;
    }
    void loadAudioInPlayer();
  }, [audio]);

  async function getAudio() {
    let url, audioTitle;
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getDate())}-${padTo2Digits(
      date.getMonth() + 1
    )}-${date.getFullYear()}`;

    if (audioLink) {
      url = audioLink;
    } else {
      console.error('audiolink undefined');
      return;
    }

    if (title) {
      audioTitle = title;
    } else {
      audioTitle = '';
      console.error('title undefined');
    }
    // TODO: get an artwork for the player

    const newAudio = {
      url,
      title: audioTitle,
      artist: currentDate,
      artwork: 'https://picsum.photos/500',
    };
    if (newAudio.url === audio.url) return;
    setAudio(newAudio);
  }

  async function loadAudioInPlayer() {
    if (audio.url === '') return;
    try {
      await audioContext.setupAndAddAudio(audio.url);
    } catch (error) {
      console.error('Error setting up and adding tracks:', error);
    }
  }

  function padTo2Digits(number: number) {
    return number.toString().padStart(2, '0');
  }

  const navigation = useNavigation();

  if (podcastInfoStr == null) {
    console.error('podcastInfoStr undefined');
    return;
  }
  const podcastInfo = JSON.parse(podcastInfoStr) as PodcastInfo[];

  const currentPodcastInfo = (currTimestamp: number) => {
    for (let i = 0; i < podcastInfo.length; i++) {
      if (
        currTimestamp >= podcastInfo[i].timestamp &&
        (i === podcastInfo.length - 1 || currTimestamp < podcastInfo[i + 1].timestamp)
      ) {
        const thumbnail =
          podcastInfo[i].thumbnail !== ''
            ? { uri: podcastInfo[i].thumbnail }
            : require('../../assets/images/Topix_zwart.png');

        return (
          <>
            <Image source={thumbnail} className="h-64 w-64" />
            <Text className="text-20 mt-8  text-center font-primary_bold text-2xl text-white">
              {podcastInfo[i].news}
            </Text>
            {i === 0 ? (
              <Text className="text-20 mt-4 font-primary text-xl text-primary">Welkom</Text>
            ) : (
              <Text
                className="text-20 mt-4 font-primary text-xl text-primary underline"
                onPress={() => {
                  void Linking.openURL(podcastInfo[i].source);
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

  if (audio.url === '') {
    return (
      <View className="flex-1 items-center justify-center bg-secondary">
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
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
        <View className={'absolute left-0 top-0 z-10 w-full'}>
          <Pressable
            className={'mt-10 flex w-full'}
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                // @ts-expect-error It complains about never but it is there
                navigation.navigate({ routeName: '(app)/index' });
              }
            }}
          >
            <Icon name={'expand-more'} color={'white'} size={52} className={'mx-2 self-start'} />
          </Pressable>
        </View>
      </>
    );
  }
};

export default AudioPlayer;
