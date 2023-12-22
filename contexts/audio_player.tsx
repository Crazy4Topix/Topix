import React, { createContext, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import { type PodcastInfo } from '../types/podcast_info';

interface Track {
  url: string;
  title: string;
  artist: string;
  track_duration: number; // Add the duration property
}

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
}

interface AudioPlayerContextProps {
  audioState: AudioPlayerState;
  podcastInfo: PodcastInfo[];
  setPodcastInfo: (podcastInfo: PodcastInfo[]) => void;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  getTime: () => Promise<number>;
  seekTo: (percentage: number) => void;
  seekForward: () => void;
  seekBackward: () => void;
  setupAndAddAudio: (audioUrl: string, title: string, artist: string) => Promise<void>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
  audioState: {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
  },
  podcastInfo: [],
  setPodcastInfo: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  getTime: async () => 0,
  seekTo: () => {},
  seekForward: () => {},
  seekBackward: () => {},
  setupAndAddAudio: async () => {},
});

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
  });
  const [podcastInfo, setPodcastInfo] = useState<PodcastInfo[]>([]);

  const getDuration = async () => {
    const info = await SoundPlayer.getInfo();
    if (info != null) {
      return info.duration
    } else {
      return 0;
    }
  };

  const playTrack = (track: Track) => {
    try {
      // Load and play the provided track
      SoundPlayer.loadUrl(track.url);
      SoundPlayer.play();
      setAudioState({ ...audioState, isPlaying: true });
    } catch (e) {
      console.error('Error playing track:', e);
    }
  };

  const pauseTrack = () => {
    try {
      // Pause the current track
      SoundPlayer.pause();
      setAudioState({ ...audioState, isPlaying: false });
    } catch (e) {
      console.error('Error pausing track:', e);
    }
  };

  const resumeTrack = () => {
    try {
      // Resume the current track
      SoundPlayer.play();
      setAudioState({ ...audioState, isPlaying: true });
    } catch (e) {
      console.error('Error resuming track:', e);
    }
  };

  const getTime = async () => {
    const info = await SoundPlayer.getInfo();
    if (info != null) {
      return info.currentTime;
    } else {
      console.error('Error getting duration: media player in react-native-sound-player is null');
      return 0;
    }
  };

  const seekTo = (percentage: number) => {
    const { currentTrack } = audioState;
    if (currentTrack) {
      try {
        // Calculate the target time based on the percentage
        const targetTime = percentage / 100 * currentTrack.track_duration;
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        SoundPlayer.play();
        setAudioState({ ...audioState, currentTime: targetTime });
      } catch (e) {
        console.error('Error seeking:', e);
      }
    }
  };

  const seekForward = async () => {
    const { currentTrack } = audioState;
    if (currentTrack) {
      try {
        // Calculate the target time based on the percentage
        const info = await SoundPlayer.getInfo();
        let targetTime = 0;
        if (info.currentTime < info.duration + 10) {
          targetTime = info.currentTime + 10;
        } else {
          targetTime = info.duration;
        }
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        setAudioState({ ...audioState, currentTime: targetTime, isPlaying: true });
      } catch (e) {
        console.error('Error seeking:', e);
      }
    }
  };

  const seekBackward = async () => {
    const { currentTrack } = audioState;
    if (currentTrack) {
      try {
        // Calculate the target time based on the percentage
        const info = await SoundPlayer.getInfo();
        let targetTime = 0;
        if (info.currentTime > 11) {
          targetTime = info.currentTime - 11;
        } else {
          targetTime = 0;
        }
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        setAudioState({ ...audioState, currentTime: targetTime });
      } catch (e) {
        console.error('Error seeking:', e);
      }
    }
  };

  const setupAndAddAudio = async (url: string, title: string, artist: string) => {
    try {
      SoundPlayer.loadUrl(url);
      SoundPlayer.play();
      const duration = await getDuration();

      const newAudioState = {
        ...audioState,
        currentTrack: {
          url,
          title,
          artist,
          track_duration: duration,
        },
        isPlaying: true,
      };
      setAudioState(newAudioState);

    } catch (e) {
      console.error('Error setting up SoundPlayer:', e);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        audioState,
        podcastInfo,
        setPodcastInfo,
        playTrack,
        pauseTrack,
        resumeTrack,
        getTime,
        seekTo,
        setupAndAddAudio,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        seekForward,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        seekBackward,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
