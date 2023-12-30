import React from 'react';
import { View } from 'react-native';
import VoiceSelection from '../components/VoiceSelection';


const VoiceSetup = () => {
  return (
    <View>
      <VoiceSelection navigationDest={'(app)'}/>
    </View>
  )
}

export default VoiceSetup;