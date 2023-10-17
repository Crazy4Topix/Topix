import React from 'react';
import { View, Text } from 'react-native';


interface Props {
    coverSource: Date;
    newsTitle: string;
    newsDuration: string;
}

const DateThumbnail: React.FC<Props> = ({ coverSource, newsTitle, newsDuration }) => {
    return (
        <View className={'flex-start mx-2'}>
            <View className={'flex justify-center bg-secondary rounded-lg w-32 h-32'}>
              <Text className={'text-primary text-center font-extrabold mt-2'}>
                <Text className={'text-5xl'}>{coverSource.getDate()+"\n"}</Text>
                <Text className={'text-xl'}>{coverSource.toLocaleDateString('default', {month: 'short'})}</Text>
              </Text>
            </View>
            <Text className={'w-32 mt-2 text-16'}>{newsTitle}</Text>
            <Text className={'mt-2 font-bold text-14'}>{newsDuration}</Text>
        </View>
    );
};

export default DateThumbnail;
