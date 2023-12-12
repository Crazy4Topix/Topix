import React from 'react';
import { View, Text, Image, type ImageSourcePropType, TouchableOpacity } from 'react-native';

interface Props {
  coverSource: ImageSourcePropType;
  newsTitle: string;
  newsDuration: string;
  onPressImage: () => void;
}

const NewsThumbnail: React.FC<Props> = ({ coverSource, newsTitle, newsDuration, onPressImage }) => {
  return (
    <TouchableOpacity onPress={onPressImage}>
      <View className={'flex-start m-2'}>
        <Image className={'h-32 w-32 rounded-lg bg-gray-200'} source={coverSource} />
        <Text className={'text-16 mt-2 w-32 font-primary'} numberOfLines={2} ellipsizeMode="tail">
          {newsTitle}
        </Text>
        <Text className={'text-14 mt-2 font-primary_bold'}>{newsDuration}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsThumbnail;
