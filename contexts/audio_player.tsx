import React, { createContext, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';

interface Track {
  url: string;
  // title: string;
  // artist: string;
  // artwork: string;
  track_duration: number; // Add the duration property
}

interface AudioPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
}

interface AudioPlayerContextProps {
  audioState: AudioPlayerState;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTo: (percentage: number) => void;
  seekForward: () => void;
  seekBackward: () => void;
  setupAndAddAudio: (audioUrl: string) => Promise<void>;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps>({
  audioState: {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
  },
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
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
  const [duration, setDuration] = useState(0);

  const getDuration = async () => {
    const info = await SoundPlayer.getInfo();
    if (info != null) {
      setDuration(info.duration);
    } else {
      console.error('Error getting duration: media player in react-native-sound-player is null');
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

  const seekTo = (percentage: number) => {
    const { currentTrack } = audioState;
    if (currentTrack) {
      try {
        // Calculate the target time based on the percentage
        const targetTime = percentage * currentTrack.track_duration;
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
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
        setAudioState({ ...audioState, currentTime: targetTime });
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

  const setupAndAddAudio = async (audioUrl: string) => {
    try {
      SoundPlayer.loadUrl(audioUrl);
      SoundPlayer.play();
      await getDuration();

      const newAudioState = {
        ...audioState,
        currentTrack: {
          url: audioUrl,
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
        playTrack,
        pauseTrack,
        resumeTrack,
        seekTo,
        setupAndAddAudio: setupAndAddAudio,
        seekForward,
        seekBackward,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
