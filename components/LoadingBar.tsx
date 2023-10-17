import React, { type FunctionComponent } from 'react';
import { View } from 'react-native';

interface OwnProps {
  percentage: number;
  className?: string;
}

type Props = OwnProps;

const LoadingBar: FunctionComponent<Props> = (props) => {
  return (
    <View className={'h-4 w-1/2 self-center rounded-full bg-gray-500'}>
      <View
        className={'absolute h-4 rounded-full bg-primary'}
        style={{ width: `${props.percentage}%` }}
      ></View>
    </View>
  );
};

export default LoadingBar;
