import { ScrollView, View, Text, Image, Pressable, ToastAndroid } from 'react-native';
import NewsThumbnail from '../../components/NewsThumbnail';
import React, { useContext, useEffect, useState } from 'react';
import DateThumbnail from '../../components/DateThumbnail';
import { Icon } from 'react-native-elements';
import { Link, router } from 'expo-router';
import AudioPlayerMinimal from '../../components/Mp3_player_minum';
import { supabase, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';
import NewsThumbnailSkeleton from '../../components/NewsThumbnailSkeleton';

export default function homePage() {
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [audioLink, setAudioLink] = useState('');
  const [fullName, setFullName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [newsThumbnails, setNewsThumbnails] = useState<React.JSX.Element[]>(
    [...Array(10).keys()].map((i) => <NewsThumbnailSkeleton key={i} />)
  );

  useEffect(() => {
    void getPodcastLink();
    void createNewsThumbnails();
  }, [userId]);

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

    void fetchFullName();
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

  async function getPodcastLink() {
    if (!userId) {
      return;
    }
    const date = new Date();
    const podcastUrl = await getNewestPodcastUrlFromSupabase(date);
    if (!podcastUrl) return;
    setAudioLink(podcastUrl.toString().replace('?', ''));
  }

  async function getNewestPodcastUrlFromSupabase(date: Date) {
    // if date is more than one week (7,5 days is 648000000 miliseconds) ago, return null
    const today = new Date();
    if (today.valueOf() - date.valueOf() > 648000000) {
      return null;
    }
    const fetchDate = `${padTo2Digits(date.getFullYear())}-${padTo2Digits(
      date.getMonth() + 1
    )}-${date.getDate()}`;
    const { data: podcast, error } = await supabase
      .from('podcasts')
      .select('podcast_link')
      .eq('user_id', userId)
      .gte('created_at', fetchDate)
      .single();
    if (error) {
      // get a day earlier
      const newDate = new Date(date.valueOf() - 86400000);
      return await getNewestPodcastUrlFromSupabase(newDate);
    }
    return podcast?.podcast_link ?? null;
  }

  function padTo2Digits(number: number) {
    return number.toString().padStart(2, '0');
  }

  function createDateThumbnails(amount: number) {
    const DateThumbnailArray = [];
    const d = new Date();
    for (let i = 0; i < amount; i++) {
      DateThumbnailArray.push(
        <DateThumbnail key={i} special={i === 0} thumbnailDate={new Date(d)}></DateThumbnail>
      );
      d.setDate(d.getDate() - 1);
    }
    return DateThumbnailArray;
  }

  async function createNewsThumbnails() {
    if (!userId) {
      return;
    }

    const NewsThumbnailArray = [];

    const lastWeekD = new Date();
    lastWeekD.setDate(lastWeekD.getDate() - 7);
    const lastWeek = `${padTo2Digits(lastWeekD.getFullYear())}-${padTo2Digits(
      lastWeekD.getMonth() + 1
    )}-${lastWeekD.getDate()}`;

    const playAudio = (link: string, title: string) => {
      router.push({ pathname: '/Mp3_player', params: { audioLink: link, title } });
    };

    // Get the speaker_id of the preferred speaker of the user
    //TODO make sure to get a default speaker when you create an account
    const { data: speakerId, error: fetchSpeakerError } = await supabase
      .from('audio_preferences')
      .select('speaker_id')
      .eq('user_id', userId)
      .single();
    if (fetchSpeakerError) {
      console.error(fetchSpeakerError);
      //TODO: remove when voiceselection is added/default voice is added
      return
    }

    const { data: items, error: fetchItemsError } = await supabase
      .from('audio')
      .select('length, link, news_id')
      .gte('created_at', lastWeek)
      .eq('speaker_id', speakerId?.speaker_id);
    if (fetchItemsError) {
      console.error(fetchItemsError);
      return;
    }

    if (!items) {
      console.error('audio items undefined');
      return;
    }

    let i = 0;
    let itemTitle = '';
    let itemDuration = '';

    for (const item of items) {
      if (item.news_id == null) continue;

      const { data: title, error } = await supabase
        .from('news')
        .select('title')
        .eq('id', item.news_id)
        .single();
      if (error) {
        console.error(error.message);
        return;
      }

      itemTitle = title?.title;
      itemDuration = `${item.length} seconden`;
      NewsThumbnailArray.push(
        <NewsThumbnail
          key={i}
          coverSource={require('../../assets/images/Topix_wit.png')}
          newsTitle={itemTitle}
          newsDuration={itemDuration}
          onPressImage={() => {
            playAudio(item.link, itemTitle);
          }}
        />
      );
      i++;
    }
    setNewsThumbnails(NewsThumbnailArray);
  }

  return (
    <View className={'flex h-full w-full justify-center bg-white'}>
      <View className={'absolute right-4 top-16 z-10'}>
        <Link href={'/profile'} asChild>
          <Pressable>
            <Icon name="account-circle" size={36} color="white" />
          </Pressable>
        </Link>
      </View>
      <ScrollView>
        <View className={'mb-2 bg-background px-2 pb-5 pt-8'}>
          <Text className={'mx-2 mt-4 text-left font-primary_bold text-3xl text-primary'}>
            {greeting}
          </Text>
          <Text className={'mx-2 mb-5 text-left font-primary_semi_bold text-2xl text-white'}>
            {fullName}
          </Text>
          <View className={'mx-2 mb-2'}>
            <View className={' flex w-full justify-center self-center rounded-xl bg-primary'}>
              <Image
                source={{
                  // TODO: get the first image of the first news item of the day
                  uri: 'https://media.nu.nl/m/ataxavzazvxs_wd854/1-op-de-3-nederlandse-scholieren-begrijpt-een-tekst-niet.jpg',
                }}
                className={'h-48 w-full self-center rounded-lg p-4 opacity-40'}
              ></Image>
            </View>
            <View className={'absolute bottom-0 left-0 right-0 top-12 z-10'}>
              <Pressable
                className={'rounded-lg p-2'}
                onPress={() => {
                  if (!audioLink) {
                    ToastAndroid.show('Geen podcasts gevonden. Probeer het morgen opnieuw', ToastAndroid.LONG);
                  } else {
                    router.push({
                      pathname: '/Mp3_player',
                      params: { audioLink, title: 'Dagelijkse Podcast' },
                    });
                  }
                }}
              >
                <Icon color={0xdeadff} name={'play-circle-outline'} size={100}></Icon>
              </Pressable>
            </View>
          </View>
        </View>
        {newsThumbnails.length > 0 && (
          <View className={'pl-2'}>
            <Text className={'m-2 font-primary_bold text-2xl'}>Overige Topix</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {newsThumbnails}
            </ScrollView>
          </View>
        )}
        <View className={'pl-2'}>
          <Text className={'m-2 font-primary_bold text-2xl'}>Terugluisteren</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {createDateThumbnails(10)}
          </ScrollView>
        </View>
        <View className={'my-2 h-16'} />
      </ScrollView>
      <View className={'absolute bottom-0 h-16 w-full'}>
        <AudioPlayerMinimal test={''} />
      </View>
    </View>
  );
}
