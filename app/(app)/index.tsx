import { ScrollView, View, Text, Image, Pressable } from 'react-native';
import NewsThumbnail from '../../components/NewsThumbnail';
import React, { useContext, useEffect, useState } from 'react';
import DateThumbnail from '../../components/DateThumbnail';
import { Icon } from 'react-native-elements';
import { Link, router } from 'expo-router';
import Mp3_player_minum from './Mp3_player_minum'
import { supabase } from '../../lib/supabase' 
import { SupabaseUserSession } from '../../contexts/user_session';
import { getFullName } from '../../lib/supabase';

export default function homePage() {
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [audioLink, setAudioLink] = useState("");
  const [fullName, setFullName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [newsThumbnails, setNewsThumbnails] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    getPodcastLink();
    createNewsThumbnails();
  },[userId])

  async function getPodcastLink(){
    if(!userId){
      return;
    }
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getFullYear())}-${padTo2Digits(date.getMonth() + 1)}-${date.getDate()}`;
    let {data:podcastUrl, error } = await supabase
      .from('podcasts')
      .select('podcast_link')
      .eq('user_id', userId)
      .gte('created_at', currentDate)
      .single()
    if(error){
      console.error(error);
    } else if(podcastUrl?.podcast_link){
      setAudioLink(podcastUrl.podcast_link.toString());
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

  async function createNewsThumbnails(){
    if(!userId){
      return; 
    }

    let NewsThumbnailArray = [];
    const d = new Date();
    const today = `${padTo2Digits(d.getFullYear())}-${padTo2Digits(d.getMonth() + 1)}-${d.getDate()}`;
    
    const playAudio = (link: string, title: string) => {
      router.push({pathname: '/Mp3_player', params: {audioLink: link, title: title}})
    };

    // Get the speaker_id of the preferenced speaker of the user
    let {data: speakerId, error: fetchSpeakerError} = await supabase
    .from('audio_preferences')
    .select('speaker_id')
    .eq('user_id', userId)
    .single()
    if(fetchSpeakerError) {
      console.error(fetchSpeakerError.message)
    }
  
    let { data: items, error: fetchItemsError } = await supabase
      .from('audio')
      .select('length, link, news_id')
      .gte('created_at', today)
      .eq('speaker_id', speakerId?.speaker_id)
    if(fetchItemsError) {
      console.error(fetchItemsError.message)
      return;
    }

    if(!items){
      console.error('audio items undefined')
      return;
    }
      
    let i = 0
    let itemTitle = ''
    let itemDuration = ''

    for (const item of items) {

      if(item.news_id == null) 
        continue

      let { data: title, error } = await supabase
        .from('news')
        .select('title')
        .eq('id', item.news_id)
        .single()
      if(error) {
        console.error(error.message)
        return;
      }
      
      itemTitle = title?.title
      itemDuration = `${item.length} seconden`
      NewsThumbnailArray.push(
        <NewsThumbnail key={i} coverSource={require("../../assets/images/TopixLogo.png")} newsTitle={itemTitle} newsDuration={itemDuration} onPressImage={() => playAudio(item.link, itemTitle)}/>
      );
      i++
      
    }
    setNewsThumbnails(NewsThumbnailArray)
  }

  useEffect(() => {
    const fetchFullName = async () => {
      try {
        if (userId) {
          const name = await getFullName(userId);
          if (name !== null) {
            setFullName(name);
          } else {
            console.error('Error fetching full name.');
          }
        }
      } catch (error: any) {
        console.error('Error fetching full name:', error.message);
      }
    };
  
    fetchFullName();
  }, [userId]);

  useEffect(() => {
    // Bepaal het tijdstip van de dag en pas de begroeting aan
    const now = new Date();
    const hours = now.getHours();

    if (hours >= 6 && hours < 12) {
      setGreeting('Goedemorgen');
    } else if (hours >= 12 && hours < 18) {
      setGreeting('Goedemiddag');
    } else if (hours >= 18 && hours < 24) {
      setGreeting('Goedenavond');
    } else {
      setGreeting('Goedenacht');
    }
  }, []);

  return (
    <View className={'flex w-full justify-center'}>
      <View className="absolute top-8 right-4 z-10">
        <Link href={'/profile'} asChild>
          <Pressable>
            <Icon name="account-circle" size={36} color="black" />
          </Pressable>
        </Link>
      </View>
      <ScrollView>
        <View className={"bg-primary pt-8 pb-4 px-2"}>
          <Text className={'mt-4 mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>{greeting},</Text>
          <Text className={'mx-2 mb-2 text-4xl text-center font-semibold font-Poppins_600_semi_bold'}>
            {typeof fullName === 'string' ? fullName : ''}
          </Text>
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

        {newsThumbnails.length > 0 && (
          <>
            <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>
              Overige Topix
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {newsThumbnails}
            </ScrollView>
          </>
        )}

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