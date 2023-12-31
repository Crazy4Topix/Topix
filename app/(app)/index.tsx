import { ScrollView, View, Text, Image, Pressable, ToastAndroid, StatusBar } from 'react-native';
import NewsThumbnail from '../../components/NewsThumbnail';
import React, { useContext, useEffect, useState } from 'react';
import DateThumbnail from '../../components/DateThumbnail';
import { Icon } from '@rneui/themed';
import { Link, router, Redirect } from 'expo-router';
import AudioPlayerMinimal from '../../components/Mp3_player_minum';
import { supabase, getFullName } from '../../lib/supabase';
import { SupabaseUserSession } from '../../contexts/user_session';
import NewsThumbnailSkeleton from '../../components/NewsThumbnailSkeleton';
import { AudioPlayerContext } from '../../contexts/audio_player';
import { type DailyPodcast, type PodcastInfo } from '../../types/podcast_info';

export default function homePage() {
  const userContext = useContext(SupabaseUserSession);
  const userId = userContext.session?.user.id;
  const [dailyPodcast, setDailyPodcast] = useState<DailyPodcast>({
    podcastInfo: [],
    podcastLink: '',
  });

  const playAudio = (link: string, title: string, podcastInfo: PodcastInfo[]) => {
    const date = new Date();
    const currentDate = `${padTo2Digits(date.getDate())}-${padTo2Digits(
      date.getMonth() + 1,
    )}-${date.getFullYear()}`;
    audioContext.setPodcastInfo(podcastInfo);
    void audioContext.setupAndAddAudio(link, title, currentDate);
    router.push({ pathname: '/Mp3_player' });
  };

  const [fullName, setFullName] = useState<string | null>('');
  const [greeting, setGreeting] = useState('');
  const [newsThumbnails, setNewsThumbnails] = useState<React.JSX.Element[]>(
    [...Array(10).keys()].map((i) => <NewsThumbnailSkeleton key={i} />),
  );
  const [oldPodcastsThumbnails, setOldPodcastsThumbnails] = useState<React.JSX.Element[]>(
    [...Array(10).keys()].map((i) => <NewsThumbnailSkeleton key={i} />),
  );

  const audioContext = useContext(AudioPlayerContext);

  useEffect(() => {
    const fetchFullName = async () => {
      if (!userId) return;
      const name = await getFullName(userId);
      setFullName(name);
    };

    void fetchFullName();
  }, [userId]);

  useEffect(() => {
    void getPodcastLink();
    void createNewsThumbnails();
    void createOldPodcastsThumbnails();
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
    const ret = await getNewestPodcastUrlFromSupabase(date);
    if (!ret) return;
    const { podcastLink, podcastInfo } = ret;
    setDailyPodcast({
      podcastInfo,
      podcastLink,
    });
  }

  async function getNewestPodcastUrlFromSupabase(date: Date) {
    // if date is more than one week (7,5 days is 648000000 miliseconds) ago, return null
    const today = new Date();
    if (today.valueOf() - date.valueOf() > 648000000) {
      return null;
    }

    const fetchDate = `${padTo2Digits(date.getFullYear())}-${padTo2Digits(
      date.getMonth() + 1,
    )}-${date.getDate()}`;

    const { data: podcast, error } = await supabase
      .from('podcasts')
      .select('podcast_link, start_timestamp,  audio_1, audio_2, audio_3')
      .eq('user_id', userId)
      .gte('created_at', fetchDate)
      .single();
    if (error) {
      const newDate = new Date(date.valueOf() - 86400000);
      return await getNewestPodcastUrlFromSupabase(newDate);
    }

    if (!podcast) {
      return null;
    }


    const newsAndTimestamps = await getPodcastInfo(
      podcast.start_timestamp,
      podcast.audio_1,
      podcast.audio_2,
      podcast.audio_3,
    );

    return { 'podcastLink': podcast.podcast_link, 'podcastInfo': newsAndTimestamps };
  }

  function padTo2Digits(number: number) {
    return number.toString().padStart(2, '0');
  }

  async function getPodcastInfo(startTimestamp: number, audio1: string, audio2: string, audio3: string) {
    const newsAndTimestamps = [
      {
        timestamp: 0,
        news: 'Podcast - intro',
        source: '',
        thumbnail: '',
      },
    ];

    const { data: NewsTmp, error: newsError } = await supabase
      .from('audio')
      .select('id, length, news(title, source, thumbnail)')
      .in('id', [audio1, audio2, audio3]);

    if (newsError) {
      console.error(newsError);
      return [];
    }

    if (!NewsTmp) {
      return [];
    }

    const News = [NewsTmp.find((news) => news.id === audio1), NewsTmp.find((news) => news.id === audio2), NewsTmp.find((news) => news.id === audio3)];

    let timestampTemp = startTimestamp;

    for (let index = 0; index < News.length; index++) {
      newsAndTimestamps.push({
        timestamp: timestampTemp,
        // @ts-expect-error database model may bot be complete
        news: News[index].news.title,
        // @ts-expect-error database model may bot be complete
        source: News[index].news.source[0],
        // @ts-expect-error database model may bot be complete
        thumbnail: News[index].news.thumbnail,
      });

      // @ts-expect-error: News always contains the ids
      timestampTemp = timestampTemp + News[index].length + 1;
    }

    return newsAndTimestamps;
  }

  async function createOldPodcastsThumbnails() {
    if (!userId) {
      return;
    }

    const DateThumbnailArray: any[] = [];

    // For DEMO purposes commented out
    // const today = new Date();
    // today.setDate(today.getDate() - 7);
    // const lastWeek = `${padTo2Digits(today.getFullYear())}-${padTo2Digits(
    //   today.getMonth() + 1,
    // )}-${today.getDate()}`;

    const { data: podcasts, error: fetchPodcastsError } = await supabase
      .from('podcasts')
      .select('podcast_link, created_at, start_timestamp,  audio_1, audio_2, audio_3')
      // .gte('created_at', lastWeek)
      .eq('user_id', userId).limit(20);
    if (fetchPodcastsError) {
      console.error(fetchPodcastsError.message);
      return;
    }

    if (!podcasts) {
      console.error('No old podcasts available');
      return;
    }

    let key = 0;
    podcasts.sort((a, b) => b.created_at.localeCompare(a.created_at))
    for (const podcast of podcasts) {
      const info = await getPodcastInfo(podcast.start_timestamp, podcast.audio_1, podcast.audio_2, podcast.audio_3);
      podcast.created_at = podcast.created_at.split('T', 1);
      DateThumbnailArray.push(
        <DateThumbnail
          key={key}
          dateString={podcast.created_at}
          onPressImage={() => {
            playAudio(podcast.podcast_link, podcast.created_at, info);
          }}
        />,
      );
      key++;
    }

    setOldPodcastsThumbnails(DateThumbnailArray);
  }

  async function createNewsThumbnails() {
    if (!userId) {
      return;
    }

    const NewsThumbnailArray = [];

    // For DEMO purposes commented out
    // const lastWeekD = new Date();
    // lastWeekD.setDate(lastWeekD.getDate() - 7);
    // const lastWeek = `${padTo2Digits(lastWeekD.getFullYear())}-${padTo2Digits(
    //   lastWeekD.getMonth() + 1,
    // )}-${lastWeekD.getDate()}`;

    // Get the speaker_id of the preferred speaker of the user
    const { data: speakerId, error: fetchSpeakerError } = await supabase
      .from('audio_preferences')
      .select('speaker_id')
      .eq('user_id', userId)
      .single();
    if (fetchSpeakerError) {
      console.error(fetchSpeakerError.message);
    }

    const { data: items, error: fetchItemsError } = await supabase
      .from('audio')
      .select('length, link, news_id')
      // .gte('created_at', lastWeek)
      .eq('speaker_id', speakerId?.speaker_id).limit(20);
    if (fetchItemsError) {
      console.error(fetchItemsError.message);
      return;
    }

    if (!items) {
      console.error('audio items undefined');
      return;
    }

    let i = 0;

    for (const item of items) {
      if (item.news_id == null) continue;

      const { data: title, error } = await supabase
        .from('news')
        .select('title, thumbnail, source')
        .eq('id', item.news_id)
        .single();
      if (error) {
        console.error(error.message);
        return;
      }

      if (!title) {
        continue;
      }

      const itemTitle = title.title;
      const itemDuration = `${item.length} seconden`;

      const podcastInfo: PodcastInfo[] = [
        {
          timestamp: 0,
          news: itemTitle,
          source: title.source[0],
          thumbnail: title.thumbnail,
        },
      ];

      NewsThumbnailArray.push(
        <NewsThumbnail
          key={i}
          coverSource={title.thumbnail}
          newsTitle={itemTitle}
          newsDuration={itemDuration}
          onPressImage={() => {
            playAudio(item.link, itemTitle, podcastInfo);
          }}
        />,
      );
      i++;
    }

    setNewsThumbnails(NewsThumbnailArray.reverse());
  }

  if (fullName === null) {
    ToastAndroid.show('Account is niet compleet, neem contact op met Crazy4.', ToastAndroid.LONG);
    return <Redirect href="/login" />;
  }

  return (
    <View className={'flex h-full w-full justify-center bg-white'}>
      <StatusBar barStyle={"light-content"}/>
      <ScrollView>
        <View className={'mb-2 bg-background px-2 pb-5 pt-8'}>
          <View className={'mx-2 flex  flex-row justify-between'}>
            <View>
              <Text className={'mt-4 text-left font-primary_bold text-3xl text-primary'}>
                {greeting}
              </Text>
              <Text className={'mb-5 text-left font-primary_semi_bold text-2xl text-white'}>
                {fullName}
              </Text>
            </View>
            <View className={' self-center'}>
              <Link href={'/profile'} asChild>
                <Pressable>
                  <Icon name="account-circle" size={36} color="white" />
                </Pressable>
              </Link>
            </View>
          </View>
          <View className={'mx-2 mb-2'}>
            <View className={' flex w-full justify-center self-center rounded-xl bg-primary'}>
              <Image
                source={
                  dailyPodcast.podcastInfo.length > 0 && dailyPodcast.podcastInfo[1].thumbnail
                    ? {
                      uri: dailyPodcast.podcastInfo[1].thumbnail,
                    }
                    : require('../../assets/images/Topix_zwart.png')
                }
                className={'h-48 w-full self-center rounded-lg p-4 opacity-40'}
              ></Image>
            </View>
            <View className={'absolute bottom-0 left-0 right-0 top-12 z-10'}>
              <Pressable
                className={'rounded-lg p-2'}
                onPress={() => {
                  if (!dailyPodcast.podcastLink) {
                    ToastAndroid.show('Geen podcasts gevonden. Probeer het morgen opnieuw', ToastAndroid.LONG);
                  } else {
                    playAudio(
                      dailyPodcast.podcastLink,
                      'Dagelijkse Podcast',
                      dailyPodcast.podcastInfo,
                    );
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

        {oldPodcastsThumbnails.length > 0 && (
          <View className={"pl-2 pb-20"}>
            <Text className={'font-Poppins_700_bold mx-2 mt-4 text-2xl font-semibold'}>
              Terugluisteren
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {oldPodcastsThumbnails}
            </ScrollView>
          </View>
        )}
      </ScrollView>
      <View className={'absolute bottom-0 h-16 w-full'}>
        <AudioPlayerMinimal />
      </View>
    </View>
  );
}
