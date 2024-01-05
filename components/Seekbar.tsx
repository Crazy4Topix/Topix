import React, { type FunctionComponent, useContext   } from 'react';
import { AudioPlayerContext } from '../contexts/audio_player';
import { Slider } from '@rneui/themed';
import { View, Text } from 'react-native';

interface OwnProps {
  currTime: number;
  className?: string;
}

type Props = OwnProps;

const Seekbar: FunctionComponent<Props> = (props) => {
  // const [valueSlider, setValueSlider] = useState(0);
  const audioContext = useContext(AudioPlayerContext);

    return (
      <View className={"w-full flex justify-center " + props.className}>
       <Slider
        value={audioContext.audioState.currentTrack ? props.currTime / audioContext.audioState.currentTrack.track_duration * 100 : 0}
        allowTouchTrack
        onSlidingStart={() => {  audioContext.pauseTrack(); }}
        thumbTouchSize={{width: 10, height: 10 }}
        onSlidingComplete={(number) => {  audioContext.seekTo(number); audioContext.resumeTrack();}}
        maximumValue={100}
        step={1}
        thumbStyle={{ height: 10, width: 10, backgroundColor: 'white' }}
        thumbTintColor={'#00DEAD'}
        minimumTrackTintColor={'#00DEAD'}
        maximumTrackTintColor={'white'}
        trackStyle={{ height: 2, borderRadius:4 }}
        style={{ width: '80%', alignSelf: 'center' }}
       />
        <View className={"flex justify-between self-center w-10/12 flex-row -mt-2"}>
          <Text className={"text-white "}>{audioContext.audioState.currentTrack ? timeToTimeString(props.currTime) : 0}</Text>
          <Text className={"text-white"}>{audioContext.audioState.currentTrack ? timeToTimeString(audioContext.audioState.currentTrack.track_duration) : 0}</Text>
        </View>
      </View>

    )
};


function timeToTimeString(time: number){
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);

  return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}


export default Seekbar;
