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
  const [oldPodcastsThumbnails, setOldPodcastsThumbnails] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    getPodcastLink();
    createNewsThumbnails();
    createOldPodcastsThumbnails();
  },[userId])

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

  async function getPodcastLink(){
    if(!userId){
      return;
    }
    const date = new Date();
    const podcastUrl = await getNewestPodcastUrlFromSupabase(date)
    if (podcastUrl == null){
      alert("We hebben geen podcast kunnen vinden, probeer het morgen opnieuw")
      return;
    }
    setAudioLink(podcastUrl.toString().replace("?", ""));
  }

  async function getNewestPodcastUrlFromSupabase(date: Date){
    // if date is more than one week (7,5 days is 648000000 miliseconds) ago, return null
    const today = new Date()
    if(today.valueOf() - date.valueOf() >  648000000){
      return null
    }
    const fetchDate = `${padTo2Digits(date.getFullYear())}-${padTo2Digits(date.getMonth() + 1)}-${date.getDate()}`;
    let {data:podcast, error } = await supabase
      .from('podcasts')
      .select('podcast_link')
      .eq('user_id', userId)
      .gte('created_at', fetchDate)
      .single()
    if(error){
      //get a day earlier
      const newDate = new Date(date.valueOf() - 86400000 )
      return getNewestPodcastUrlFromSupabase(newDate)
    }
    return podcast?.podcast_link ?? null
  }

  function padTo2Digits(number:number){
    return number.toString().padStart(2, '0');
  }

  async function createOldPodcastsThumbnails(){
    if (!userId){
      return;
    }

    const DateThumbnailArray: any[] = [];
    const today = new Date();
    today.setDate(today.getDate() - 7);

    const lastWeek = `${padTo2Digits(today.getFullYear())}-${padTo2Digits(today.getMonth() + 1)}-${today.getDate()}`;
    console.log(lastWeek)

    const playAudio = (link: string, title: string) => {
      router.push({pathname: '/Mp3_player', params: {audioLink: link, title: title}})
    };

    //Get all audio links for userID that are at most one week old

    let { data: podcasts, error: fetchPodcastsError } = await supabase
      .from('podcasts')
      .select('podcast_link, created_at')
      .gte('created_at', lastWeek)
      .eq('user_id', userId)
    if(fetchPodcastsError) {
      console.error(fetchPodcastsError.message)
      return;
    }

    if(!podcasts){
      return;
    }
    let key = 0
    
    podcasts.forEach(podcast => {
      podcast.created_at = podcast.created_at.split("T",1);
      DateThumbnailArray.push(
        <DateThumbnail key={key} dateString={podcast.created_at} onPressImage={() => console.log("click")}/>
      );
      key++;
    });

    setOldPodcastsThumbnails(DateThumbnailArray)
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

        {oldPodcastsThumbnails.length > 0 && (
          <>
            <Text className={'mt-4 mx-2 text-2xl font-semibold font-Poppins_700_bold'}>
              Terugluisteren
              </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
              {oldPodcastsThumbnails}
            </ScrollView>
          </>
        )}  
        
      </ScrollView>
      <View className='absolute bottom-0 w-full'>
        <Mp3_player_minum></Mp3_player_minum>
      </View>
    </View>
  );
}