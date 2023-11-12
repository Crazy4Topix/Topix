import React, { createContext, useEffect, useState } from 'react';
import SoundPlayer from 'react-native-sound-player';
import { supabase } from '../lib/supabase';

interface Track {
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number; // Add the duration property
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
  setupAndAddTracks: () => Promise<void>;
  testfunc: () => void;
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
  setupAndAddTracks: async () => {},
  testfunc: () => {},

});


export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
  });
  const [audioLink, setAudioLink] = useState('');

  const playTrack = (track: Track) => {
    try {
      // Load and play the provided track
      SoundPlayer.loadUrl(track.url);
      SoundPlayer.play();
      setAudioState({ ...audioState, currentTrack: track, isPlaying: true });
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
        const targetTime = percentage * currentTrack.duration;
        // Seek to the calculated time
        SoundPlayer.seek(targetTime);
        setAudioState({ ...audioState, currentTime: targetTime });
      } catch (e) {
        console.error('Error seeking:', e);
      }
    }
  };

  const setupAndAddTracks = async () => {
    try {
      // Fetch the audio link from Supabase
      console.log("test2")
      const { data: audio, error } = await supabase
        .from('audio')
        .select('link')
        .single();
      if (error !== null) {
        console.error('Error fetching audio link:', error);
      } else if (audio !== null) {
        const audioUrl = audio.link;
        setAudioLink(audioUrl); // Set the audio link in the state

        // Load and play the audio using the extracted URL
        SoundPlayer.loadUrl(audioUrl);
        SoundPlayer.play();
        seekTo(0); // Use the function from the context
      }
    } catch (e) {
      console.error('Error setting up SoundPlayer:', e);
    }
  };

  const testfunc = () => {
    console.log("testfunc")
  };

  useEffect(() => {
    // You can add any additional initialization logic here
  }, []);

  return (
    <AudioPlayerContext.Provider value={{ audioState, playTrack, pauseTrack, resumeTrack, seekTo, setupAndAddTracks, testfunc }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};
