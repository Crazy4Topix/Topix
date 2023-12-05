import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { Icon } from 'react-native-elements';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { router, useLocalSearchParams } from 'expo-router';

const AudioPlayer = () => {
  const audioContext = useContext(AudioPlayerContext);
  const [audio, setAudio] = useState({ url: '', title: '', artist: '', artwork: '' });
  const { audioLink, title } = useLocalSearchParams<{ audioLink?: string; title?: string }>();

  useEffect(() => {
    void getAudio();
  }, []);

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
      url: url,
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

  if (audio.url === '') {
    return (
      <View className="flex-1 items-center justify-center bg-secondary">
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <>
        <View className="flex-1 items-center justify-center bg-background">
          <Image source={{ uri: audio.artwork }} className="h-64 w-64" />
          <Text className="text-20 mt-8 font-primary_bold text-3xl text-white">{audio.title}</Text>
          <Text className="text-20 mt-4 font-primary text-xl text-white">{audio.artist}</Text>
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
                router.replace('index');
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
