import React, { createContext, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import { type PodcastInfo } from '../types/podcast_info';

const TIMEOUT = 100;

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
  lastTimeCheck: Date;
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
    lastTimeCheck: new Date(),
  },
  podcastInfo: [],
  setPodcastInfo: () => {
  },
  playTrack: () => {
  },
  pauseTrack: () => {
  },
  resumeTrack: () => {
  },
  getTime: async () => 0,
  seekTo: () => {
  },
  seekForward: () => {
  },
  seekBackward: () => {
  },
  setupAndAddAudio: async () => {
  },
});

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    lastTimeCheck: new Date(),
  });
  const [podcastInfo, setPodcastInfo] = useState<PodcastInfo[]>([]);

  const getDuration = async () => {
    const info = await SoundPlayer.getInfo();

    if (info) {
      return info.duration;
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

  SoundPlayer.onFinishedPlaying(async () => {
    setAudioState({ ...audioState, isPlaying: false, currentTime: 0, lastTimeCheck: new Date() });
  })

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
    const now = new Date();
    // @ts-expect-error: lastTimeCheck is a Date
    if ((now - audioState.lastTimeCheck) < TIMEOUT) {
      return audioState.currentTrack?.track_duration ?? 0;
    }

    let info = null;
    await Promise.race([
      info = await SoundPlayer.getInfo(),
      // eslint-disable-next-line promise/param-names
      new Promise((_, reject) => setTimeout(() => {
        reject(new Error('timeout'));
      }, TIMEOUT)),
    ]);


    if (info != null) {
      setAudioState({ ...audioState, lastTimeCheck: new Date(), currentTime: info.currentTime });

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
        setAudioState({ ...audioState, currentTime: targetTime, isPlaying: true, lastTimeCheck: new Date() });
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
        let targetTime = 0;
        if (audioState.currentTime < currentTrack.track_duration + 10) {
          targetTime = audioState.currentTime + 10;
        } else {
          targetTime = currentTrack.track_duration;
        }
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        SoundPlayer.play();
        setAudioState({ ...audioState, currentTime: targetTime, isPlaying: true, lastTimeCheck: new Date() });
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
        let targetTime = 0;
        if (audioState.currentTime > 11) {
          targetTime = audioState.currentTime - 11;
        } else {
          targetTime = 0;
        }
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        setAudioState({ ...audioState, currentTime: targetTime, lastTimeCheck: new Date() });
      } catch (e) {
        console.error('Error seeking:', e);
      }
    }
  };

  const setupAndAddAudio = async (url: string, title: string, artist: string) => {
    try {
      SoundPlayer.loadUrl(url);

      const duration = await getDuration();
      const newAudioState = {
        ...audioState,
        currentTrack: {
          url,
          title,
          artist,
          track_duration: duration,
        },
        currentTime: 0,
        lastTimeCheck: new Date(),
        isPlaying: true,
      };
      setAudioState(newAudioState);
      SoundPlayer.play();
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
