import React from 'react';
import { View, Text, Image, type ImageSourcePropType } from 'react-native';


interface Props {
    coverSource: ImageSourcePropType;
    newsTitle: string;
    newsDuration: string;
}

const NewsThumbnail: React.FC<Props> = ({ coverSource, newsTitle, newsDuration }) => {
    return (
        <View className={'flex-start m-2'}>
            <Image className={'w-32 h-32 rounded-lg'} source={coverSource}/>
            <Text className={'w-32 mt-2 text-16'} numberOfLines={2} ellipsizeMode="tail">{newsTitle}</Text>
            <Text className={'mt-2 font-bold text-14'}>{newsDuration}</Text>
        </View>
    );
};

export default NewsThumbnail;
