import React, { type FunctionComponent, useContext, useState } from 'react';
import { View } from 'react-native';
import { AudioPlayerContext } from '../contexts/audio_player';

interface OwnProps {
    percentage: number;
    className?: string;
}

type Props = OwnProps;

const Seekbar: FunctionComponent<Props> = (props) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [totalWidth, setTotalWidth] = useState(0);
    const audioContext = useContext(AudioPlayerContext);
    console.log(scrollPercentage);
    return (
        <View className={'h-4 w-3/4 self-center rounded-full bg-gray-500'}

              onLayout={
                  (e) => {
                      setTotalWidth(e.nativeEvent.layout.x + e.nativeEvent.layout.width)
                  }
              }
              onTouchStart={
            (e) => {
                setIsScrolling(true);
                setScrollPercentage(e.nativeEvent.locationX / totalWidth * 100);
            }
        } onTouchMove={
            (e) => {
                if (isScrolling) {
                    setScrollPercentage(e.nativeEvent.locationX / totalWidth * 100);
                }
            }
        } onTouchEnd={
            (e) => {
                setIsScrolling(false);
                console.log(scrollPercentage)
                audioContext.seekTo(scrollPercentage);
                setScrollPercentage(0);
            }
        }>
            <View
                className={'absolute h-4 rounded-full bg-primary'}
                style={{ width: `${isScrolling ? scrollPercentage : props.percentage}%` }}
            ></View>
        </View>);
};

export default Seekbar;
