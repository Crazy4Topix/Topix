import React, { type FunctionComponent } from 'react';
import { Pressable, View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from "lottie-react-native";
import { styled } from 'nativewind';

const Introduction: FunctionComponent = () => {
  const navigation = useNavigation();

  const StyledLottieView = styled(LottieView);
  return (
    <View className={'h-full pt-12 flex justify-between bg-white'}>
      <ScrollView className={"pt-52"} pagingEnabled={true} horizontal={true} directionalLockEnabled={true}>
        <View className={"w-screen flex"}>
          <Text className={"px-5 text-black text-3xl text-left font-primary_bold my-1 "}>
            Welkom bij de voice clone tool van Topix. Hiermee kun je je eigen stem klonen en gebruiken om het nieuws voor te lezen.
          </Text>
          <StyledLottieView className={"-mt-10 w-screen"} source={require("../../../assets/lottie/swipe.json")} autoPlay loop />
        </View>
        <Text className={"text-black text-3xl text-left font-primary_bold my-1 w-screen px-5"}>
          Op de volgende pagina kun je je eigen stem opnemen. Dit duurt ongeveer 1 minuut.
        </Text>
        <Text className={"text-black text-3xl text-left font-primary_bold my-1 w-screen px-5"}>
          Op de pagina staat een tekst die je kunt voorlezen. Lees deze tekst voor en druk op de knop om de opname te starten.
        </Text>
        <Text className={"text-black text-3xl text-left font-primary_bold my-1 w-screen px-5"}>
          Als je klaar bent met de opname druk je nogmaals op de knop om de opname te stoppen.
        </Text>
        <Text className={"text-black text-3xl text-left font-primary_bold my-1 w-screen px-5"}>
          Tip: lees de tekst voor zoals je het nieuws zou voorlezen en lees de tekst vantevoren een keer door.
        </Text>
      </ScrollView>
      <View className={"flex h-32 justify-center"}>
          <Pressable className={'w-32 h-16 rounded-full bg-primary flex justify-center self-center'} onPress={ () => {
            // @ts-expect-error: route is there
            navigation.navigate("CreateVoiceClone")
          }}>
            <Text className={"text-center text-white text-lg font-primary_bold"}>Start</Text>
          </Pressable>
      </View>
    </View>
  );
};

export default Introduction;
