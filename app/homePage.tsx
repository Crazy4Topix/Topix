import { ScrollView, View, Text } from 'react-native';
import NewsThumbnail from '../components/NewsThumbnail';
import React from 'react';
import DateThumbnail from '../components/DateThumbnail';


export default function homePage() {
  return (
    <View className={'mt-12 flex w-full justify-center'}>
      <Text className={'mt-4 mx-2 mb-2 text-xl font-semibold'}>Overige Topix</Text>
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
      <Text className={'mt-4 mx-2 mb-2 text-xl font-semibold'}>Terugluisteren</Text>
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
    </View>
  );
}
