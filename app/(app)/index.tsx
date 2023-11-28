import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import NewsThumbnail from '../../components/NewsThumbnail';
import React, { useContext, useEffect, useState } from 'react';
import DateThumbnail from '../../components/DateThumbnail';
import { Icon } from 'react-native-elements';
import { Link, router } from 'expo-router';
import Mp3_player_minum from './Mp3_player_minum'
import { supabase } from '../../lib/supabase' 
import { SupabaseUserSession } from '../../contexts/user_session';

export default function homePage() {
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [audioLink, setAudioLink] = useState("");

  useEffect(() => {
    getPodcastLink();
  },[userId])

  async function getPodcastLink(){
    if(!userId){
      return;
    }
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getFullYear())}-${padTo2Digits(date.getMonth() + 1)}-${date.getDate()}`;
    // TODO: fetch base link from server, don't hardcode it this way.
    console.log(userId);
    let {data:podcastUrl, error } = await supabase
      .from('podcasts')
      .select('podcast_link')
      .eq('user_id', userId)
      .gte('created_at', currentDate)
      .single()
    if(error){
      console.error(error);
    } else if(podcastUrl){
      setAudioLink(podcastUrl.toString());
    } else {
      console.error('Podcast link is null')
    }
    
  }

  function padTo2Digits(number:number){
    return number.toString().padStart(2, '0');
  }

  function createDateThumbnails(amount: number){
    const DateThumbnailArray = [];
    const d = new Date();
    for (let i=0; i<amount; i++){
      DateThumbnailArray.push(
        <DateThumbnail key={i} coverSource={new Date(d)}></DateThumbnail>
      );
      d.setDate(d.getDate() - 1);
    }
    return DateThumbnailArray;
  }

  function createNewsThumbnails(amount: number){
    const NewsThumbnailArray = [];
    for (let i=0; i<amount; i++){
      NewsThumbnailArray.push(
        <NewsThumbnail key={i} coverSource={require("../../assets/images/TopixLogo.png")} newsTitle={'Datalek bij topix'} newsDuration={'42 seconde'}/>
      );
    }
    return NewsThumbnailArray;
  }

  return (
    <View className={'flex w-full justify-center'}>
      <ScrollView>
        <View className={"bg-primary pt-8 pb-4 px-2"}>
          <Text className={'mt-4 mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Goedemorgen,</Text>
          <Text className={'mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>Stefan</Text>
          <View>
            <View id={"background"} className={"mx-2 rounded-xl bg-background flex justify-center"}>
              <Image source={require("../../assets/waveform.png")} className={"m-4 h-48 w-10/12 self-center"}></Image>
            </View>
            <View id={"foreground"} className={"absolute left-0 right-0  bottom-0 top-16"}>
              <Pressable className={'rounded-lg p-2'} onPress={() => router.push({pathname:'/Mp3_player', params:{audioLink:audioLink, title:"Dagelijkse Podcast"}})}>
                <Icon id={"foreground"}  color={0x00DEADFF} name={"play-circle-outline"} size={100}></Icon>
              </Pressable>
            </View>
          </View>
        </View>
      <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>Overige Topix</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        { createNewsThumbnails(10) }
      </ScrollView>
      <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>Terugluisteren</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        { createDateThumbnails(10) }
      </ScrollView>
      </ScrollView>
      <View className='absolute bottom-0 w-full'>
        <Mp3_player_minum></Mp3_player_minum>
      </View>
    </View>
  );
}
