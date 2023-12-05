import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';


interface Props {
    dateString: string;
    onPressImage: () => void;
}

const DateThumbnail: React.FC<Props> = ({ dateString, onPressImage }) => {
  //const date = new Date(dateString)
    return (
      <TouchableOpacity onPress={onPressImage}>
        <View>
          <Text className={'text-primary pt-1 text-center font-extrabold mt-2'}>
            AAAAA
          </Text>
        </View>
      </TouchableOpacity>
    );
};

export default DateThumbnail;
