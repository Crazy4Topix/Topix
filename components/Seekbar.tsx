import React, { type FunctionComponent, useContext } from 'react';
import { AudioPlayerContext } from '../contexts/audio_player';
import { Slider } from 'react-native-elements';
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
      <View className={"w-full flex justify-center"}>
       <Slider
        value={audioContext.audioState.currentTrack ? props.currTime / audioContext.audioState.currentTrack.track_duration * 100 : 0}
        onSlidingStart={() => { audioContext.pauseTrack(); }}
        onSlidingComplete={(number) => { audioContext.seekTo(number);}}
        maximumValue={100}
        step={1}
        thumbStyle={{ height: 10, width: 10, backgroundColor: 'white' }}
        thumbTintColor={'#00DEAD'}
        minimumTrackTintColor={'#00DEAD'}
        maximumTrackTintColor={'white'}
        trackStyle={{ height: 2 }}
        style={{ width: '80%', alignSelf: 'center' }}
       />
        <View className={"flex justify-between self-center w-10/12 flex-row -mt-2"}>
          <Text className={"text-white "}>{audioContext.audioState.currentTrack ? (props.currTime / 60).toFixed(2) : 0}</Text>
          <Text className={"text-white"}>{audioContext.audioState.currentTrack ? (audioContext.audioState.currentTrack.track_duration / 60).toFixed(2) : 0}</Text>
        </View>
      </View>

    )
};

export default Seekbar;