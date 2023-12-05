import React from 'react';
import { View, Text } from 'react-native';


interface Props {
    coverSource: string;
}

const DateThumbnail: React.FC<Props> = ({ coverSource}) => {
  const date = new Date(coverSource)
    return (
      <View className={'flex-start  m-2 justify-center bg-gray-200 rounded-lg w-32 h-32'}>
        <Text className={'text-primary pt-1 text-center font-extrabold mt-2'}>
          <Text className={'text-5xl'}>{date.getDate()+"\n"}</Text>
          <Text className={'text-xl'}>{date.toLocaleDateString('default', {month: 'short'})}</Text>
        </Text>
      </View>
    );
};

export default DateThumbnail;
