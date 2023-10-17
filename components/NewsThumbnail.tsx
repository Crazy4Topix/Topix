import React from 'react';
import { View, Text, Image, type ImageSourcePropType } from 'react-native';


interface Props {
    coverSource: ImageSourcePropType;
    newsTitle: string;
    newsDuration: string;
}

const NewsThumbnail: React.FC<Props> = ({ coverSource, newsTitle, newsDuration }) => {
    return (
        <View className={'flex-start mx-2'}>
            <Image className={'w-32 h-32 rounded-lg'} source={coverSource}/>
            <Text className={'mt-2 text-16'}>{newsTitle}</Text>
            <Text className={'mt-2 font-bold text-14'}>{newsDuration}</Text>
        </View>
    );
};

export default NewsThumbnail;
