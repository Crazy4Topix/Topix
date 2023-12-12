import React, { useState, type FunctionComponent, useEffect } from 'react';
import { Image, View } from 'react-native';
import LoadingBar from './LoadingBar';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';

interface OwnProps extends NativeStackHeaderProps {}

type Props = OwnProps;

const SignUpHeader: FunctionComponent<Props> = (props: OwnProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if (props.route.name === 'signup') {
      setPercentage(25);
    } else if (props.route.name === 'userInformation') {
      setPercentage(50);
    } else if (props.route.name === 'topicSelection') {
      setPercentage(75);
    } else {
      setPercentage(0);
    }
  }, [props.route.name]);

  return (
    <View className={'flex w-full justify-center bg-white pt-12'}>
      <Image
        source={require('../assets/images/Topix_wit.png')}
        className={' h-24 w-8/12 self-center'}
      />
      <View className={'py-5'}>
        <LoadingBar percentage={percentage} />
      </View>
    </View>
  );
};

export default SignUpHeader;
