import React, { useState, type FunctionComponent, useEffect } from 'react';
import { Image, View } from 'react-native';
import LoadingBar from './LoadingBar';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';

interface OwnProps extends NativeStackHeaderProps {}

type Props = OwnProps;

const SignUpHeader: FunctionComponent<Props> = (props: OwnProps) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    console.log(props.route.name, props.route.name === 'signup');
    if (props.route.name === 'signup') {
      console.log('25 percent');
      setPercentage(25);
    } else if (props.route.name === 'userInformation') {
      console.log('50 percent');
      setPercentage(50);
    } else if (props.route.name === 'topicSelection') {
      console.log('75 percent');
      setPercentage(75);
    } else {
      console.log('Nothing');
      setPercentage(0);
    }
  }, [props.route.name]);

  return (
    <View className={'mt-12 flex w-full justify-center'}>
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
