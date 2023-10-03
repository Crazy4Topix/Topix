import { View, Text } from 'react-native';
import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { styled } from 'nativewind';

export default function TabOneScreen() {
  const animation = useRef(null);

  useEffect(() => {
    if (animation.current != null) {
      // @ts-expect-error: Type is wrong
      animation.current.play();
    }
  }, []);

  const StyledLottieView = styled(LottieView);
  return (
    <View className=" flex h-full w-full justify-center bg-amber-800">
      <Text className="self-center p-3 pt-4 text-2xl text-yellow-300">Hello TOPIX</Text>
      <StyledLottieView
        autoPlay
        ref={animation}
        className={'w-56 self-center'}
        source={require('../../assets/lottie/talking.json')}
        loop
      />
    </View>
  );
}
