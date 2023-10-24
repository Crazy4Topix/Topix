import { ScrollView, View, Text, Image } from 'react-native';
import NewsThumbnail from '../components/NewsThumbnail';
import React from 'react';
import DateThumbnail from '../components/DateThumbnail';
import { Icon } from 'react-native-elements';


function createDateThumbnails(numDays: number){

}

export default function homePage() {
  return (
    <View className={'flex w-full justify-center'}>
      <ScrollView>
        <View className={"bg-primary pt-8 pb-4 px-2"}>
          <Text className={'mt-4 mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Goedemorgen,</Text>
          <Text className={'mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Stefan</Text>
          <View>
            <View id={"background"} className={"mx-2 rounded-xl bg-background flex justify-center"}>
              <Image source={require("../assets/waveform.png")} className={"m-4 h-48 w-10/12 self-center"}></Image>
            </View>
            <View id={"foreground"} className={"absolute left-0 right-0  bottom-0 top-16"}>
              <Icon id={"foreground"}  color={0x00DEADFF} name={"play-circle-outline"} size={100}></Icon>
            </View>
          </View>
        </View>
      <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>Overige Topix</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
        <NewsThumbnail coverSource={require("../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
      </ScrollView>
      <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>Terugluisteren</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        <DateThumbnail coverSource={new Date()}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-16")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-15")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-14")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-13")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-12")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-11")}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-10")}></DateThumbnail>
      </ScrollView>
      </ScrollView>
    </View>
  );
}
