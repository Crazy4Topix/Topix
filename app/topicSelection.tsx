import React from 'react';
import { View } from 'react-native';
import TopicSelection from '../components/TopicSelection';


const TopicSetup = () => {
  return (
    <View>
      <TopicSelection navigationDest={'voiceSelection'}/>
    </View>
  )
}

export default TopicSetup;
