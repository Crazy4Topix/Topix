import React, { type FunctionComponent, useContext } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { buyPremium } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';



const BuyPremium: FunctionComponent = () => {

  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const {session} = useContext(SupabaseUserSession);

  return (<View className={"pt-12 px-3"}>
    <View className="absolute top-12 left-4 z-20">
      <Pressable onPress={handleGoBack}>
        <Icon name="keyboard-return" size={36} color="black" />
      </Pressable>
    </View>
    <View id={'background'} className={'absolute left-0 top-0 z-0 h-full w-full'}>
      <Image
        source={require('../../assets/images/audio.png')}
        className={'absolute -bottom-16 -left-16 aspect-square h-56 w-52'}
      />
      <Image
        source={require('../../assets/images/rss.png')}
        className={'absolute -right-16 -top-16 aspect-square h-52 w-52'}
      />
    </View>
    <View id={"front"} className={"w-full h-full pt-32"}>
    <Image
      source={require('../../assets/images/Topix_wit.png')}
      className={'h-24 w-8/12 self-center'}
    />
      <View className={"flex flex-row w-full justify-center"}>
        <Text className={"text-2xl font-primary_bold text-center"}>Koop nu </Text>
        <Text className={"text-2xl font-primary_extra_bold text-center text-yellow-600"}>premium</Text>
      </View>
      <Text className={"text-2xl font-primary_bold text-center"}>voor 4,99 per maand</Text>
      <View className={"self-center w-3/4 pt-12"}>
        <Text className={"text-xl font-primary text-left"}>- Geen advertenties</Text>
        <Text className={"text-xl font-primary text-left"}>- Eigen podcast stem</Text>
        <Text className={"text-xl font-primary text-left"}>- Premium stemmen</Text>
        <Text className={"text-xl font-primary text-left"}>- Eigen Topix (binnenkort)</Text>
        <Text className={"text-xl font-primary text-left"}>- Eigen nieuwsbronnen {"\n"}   (binnenkort)</Text>
      </View>
      <Pressable className={"bg-yellow-600 rounded-2xl w-3/4 self-center py-2 mt-8"} onPress={() => {
        if(session?.user.id){
          buyPremium(session?.user.id).then(() => {
            navigation.goBack();
          }).catch((e) => {
            console.error(e);
          })
        }
      }}>
        <Text className={"text-xl font-primary_bold text-center text-white"}>Koop premium</Text>
      </Pressable>
    </View>
  </View>);
};

export default BuyPremium;
