import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  thumbnailDate: Date;
  special: boolean;
}

const DateThumbnail: React.FC<Props> = ({ thumbnailDate, special }) => {
  return (
    <View className={'flex-start  m-2 h-32 w-32 justify-center rounded-lg bg-gray-200'}>
      <Text
        className={`mt-2 pt-1 text-center font-primary_extra_bold ${
          special ? 'text-accent' : 'text-primary'
        }`}
      >
        <Text className={'text-5xl'}>{thumbnailDate.getDate() + '\n'}</Text>
        <Text className={'text-xl'}>
          {thumbnailDate.toLocaleDateString('default', { month: 'short' })}
        </Text>
      </Text>
    </View>
  );
};

export default DateThumbnail;
