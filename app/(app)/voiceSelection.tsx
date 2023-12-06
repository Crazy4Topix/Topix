import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';
import { Icon } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown'; // Import the Dropdown component
import AntDesign from '@expo/vector-icons/AntDesign';

interface Voice {
  display_name: string;
  id: string;
  name: string;
}

export default function ProfilePage() {
  const navigation = useNavigation();
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [voices, setVoices] = useState<Voice[] | null>(null);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isDropdownFocus, setIsDropdownFocus] = useState(false);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const fetchSpeakersName = async () => {
    try {
      const { data: speakers, error } = await supabase
        .from('speakers')
        .select('display_name, id, name');
      if (error != null) {
        console.log(error);
      }
      setVoices(speakers as Voice[] | null);
    } catch (error) {
      console.error('Error fetching speakers:', error.message);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleDropdownFocus = () => {
    setIsDropdownFocus(true);
  };

  const handleDropdownBlur = () => {
    setIsDropdownFocus(false);
  };

  const handleVoiceSelection = (value: string | null) => {
    setSelectedValue(value);
    // Access the selected voice using voices.find(voice => voice.id === value)
    const selectedVoice = voices ? voices.find(voice => voice.id === value)?.display_name : null;
    // Do something with the selected voice...
  };

  useEffect(() => {
    void fetchSpeakersName();
  }, []);

  if (!voices || voices === null) {
    return null; // or a loading component if you prefer
  }
  console.log(voices)
  const data = voices.map(voice => ({ label: voice.display_name, value: voice.id }))
  console.log(data)

  return (
    <View style={{ flex: 1, justifyContent: 'center',backgroundColor: 'white' }}>
      <View style={{ position: 'absolute', top: 8, left: 4, zIndex: 10 }}>
        <Pressable onPress={handleGoBack}>
          <Icon name="keyboard-return" size={36} color="black" />
        </Pressable>
      </View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Kies welke stem je wilt horen:</Text>

      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? 'blue' : 'black'}
              name="Safety"
              size={20}
            />
          )}
        />
      </View>
    </View>

    
  );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });