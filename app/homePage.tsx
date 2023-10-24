import { ScrollView, View, Text, Image } from 'react-native';
import NewsThumbnail from '../components/NewsThumbnail';
import React from 'react';
import DateThumbnail from '../components/DateThumbnail';
import { Icon } from 'react-native-elements';


export default function homePage() {
  return (
    <View className={'mt-12 flex w-full justify-center'}>
      <ScrollView>
        <View className={"bg-primary py-4 px-2"}>
          <Text className={'mt-4 mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Goedemorgen,</Text>
          <Text className={'mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Stefan</Text>
          <View className={"mx-2 rounded-xl bg-background flex justify-center"}>
            <Image source={require("../assets/waveform.png")} className={"m-4 h-48 w-10/12 self-center"}></Image>
            {/* <Icon name={"play-circle-outline"} className={"fg-primary"}></Icon> */}
          </View>
        </View>
      <Text className={'mt-4 mx-2 mb-2 text-2xl font-semibold font-Poppins_700_bold'}>Overige Topix</Text>
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
      <Text className={'mt-4 mx-2 mb-2 text-2xl font-semibold font-Poppins_700_bold'}>Terugluisteren</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        <DateThumbnail coverSource={new Date()} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-16")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-15")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-14")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-13")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-12")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-11")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
        <DateThumbnail coverSource={new Date("2023-10-10")} newsTitle={'Radboud bestaat 100 jaar'} newsDuration={"5 seconde"}></DateThumbnail>
      </ScrollView>
      </ScrollView>
    </View>
  );
}
