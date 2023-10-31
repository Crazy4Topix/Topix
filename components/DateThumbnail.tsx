import React from 'react';
import { View, Text } from 'react-native';


interface Props {
    coverSource: Date;
}

const DateThumbnail: React.FC<Props> = ({ coverSource}) => {
    return (
      <View className={'flex-start  m-2 justify-center bg-gray-200 rounded-lg w-32 h-32'}>
        {/* <Text textBreakStrategy={"simple"} className={"pt-1 font-extrabold text-center font-extrabold text-6xl"}>31</Text> */}
        <Text className={'text-primary pt-1 text-center font-extrabold mt-2'}>
          <Text className={'text-5xl'}>{coverSource.getDate()+"\n"}</Text>
          <Text className={'text-xl'}>{coverSource.toLocaleDateString('default', {month: 'short'})}</Text>
        </Text>
      </View>
    );
};

export default DateThumbnail;
