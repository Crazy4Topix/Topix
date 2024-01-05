import React, { useState, useContext, useEffect } from 'react';
import { Pressable, SafeAreaView, View, Text, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SupabaseUserSession } from '../contexts/user_session';

interface Topic {
  text: string;
  value: string;
  state: string;
}

interface Navigation {
  navigationDest: string;
}

const TopicSelection: React.FC<Navigation> = ({ navigationDest }) => {
  const [topics, setTopics] = useState<Topic[]>();

  const navigation = useNavigation();
  const userContext = useContext(SupabaseUserSession);

  const handlePress = (topic: Topic) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) => {
        if (t.value === topic.value) {
          // Cycle through the states: neutral -> positive -> negative -> neutral
          t.state =
            t.state === 'neutral' ? 'positive' : t.state === 'positive' ? 'negative' : 'neutral';
        }
        return t;
      })
    );
  };

  const getBackgroundColor = (state: string): string => {
    if (state === 'positive') {
      return 'bg-primary';
    } else if (state === 'negative') {
      return 'bg-red-400';
    } else {
      return 'bg-gray-300';
    }
  };

  const handleSubmit = async () => {
    const userId = userContext.session?.user.id;

    const topicsSelected = topics.filter(
      (topic) => topic.state === 'positive' || topic.state === 'negative'
    );
    const selectedTopicNames = topicsSelected.map((topic) => topic.value);
    const { data: topicID, error: topicError } = await supabase
      .from('topic')
      .select('id')
      .in('name', selectedTopicNames);

    if (topicError !== null) {
      console.error(topicError);
    }

    // Delete all rows
    const { error: delError } = await supabase
      .from('topic_preferences')
      .delete()
      .eq('user_id', userId);
    if (delError !== null) {
      console.error(delError);
    }

    // Map each ID to an object with user_id and topic_id
    const rowsToInsert = topicID?.map((id, index) => ({
      user_id: userId,
      positive: topicsSelected[index].state === 'positive',
      topic_id: id.id,
    }));

    // Insert the rows into the 'topic_preferences' table
    const { data, error } = await supabase.from('topic_preferences').insert(rowsToInsert).select();

    if (error !== null) {
      console.error(error);
    }

    // @ts-expect-error It complains about never but it is there
    navigation.navigate(navigationDest);
  };

  const loadCurrentTopics = async () => {
    const userId = userContext.session?.user.id;
  
    try {
      // Read current topics
      const { data: curTopics, error: fetchError } = await supabase
        .from('topic_preferences')
        .select('*')
        .eq('user_id', userId);
  
      if (fetchError !== null) {
        console.error('Error getting current topics:', fetchError);
        return;
      }
  
      const allTopicsQuery = await supabase
        .from('topic')
        .select('*');
      const { data: allTopics, error: allTopicsError } = allTopicsQuery;
  
      if (allTopicsError !== null) {
        console.error('Error fetching all topics:', allTopicsError);
        return;
      }
  
      const mergedList = allTopics?.map(topic => {
        const curTopic = curTopics?.find(cur => cur.topic_id === topic.id);
        return {
          text: topic.display_name,
          value: topic.name,
          state: curTopic?.positive ? 'positive' : curTopic?.positive === false ? 'negative' : 'neutral',
        };
      });
  
      // Set the mergedList directly in the state
      setTopics(mergedList);
  
    } catch (error) {
      console.error('Error in loadCurrentTopics:', error);
    }
  };
  
  

useEffect(() => {
  void loadCurrentTopics();
}, []);
  
  return (
    <View className={'flex-centering h-full w-full bg-white pb-4'}>
      <ScrollView className={'bg-white'}>
        <View className={'flex h-full w-full justify-center  pt-12'}>
          <Text className={'mx-8 pb-10 text-center font-primary_medium text-2xl'}>
            <Text>Kies de</Text>
            <Text className={'font-primary_bold'}> Topix </Text>
            <Text>die jij interessant vindt{'\n\n'}</Text>
            <Text className={'text-sm'}>Klik twee keer als je</Text>
            <Text className={'font-primary_bold text-sm'}> Topix </Text>
            <Text className={'text-sm'}>niet wil zien</Text>
          </Text>
          <SafeAreaView className={'flex flex-row flex-wrap justify-center gap-2 self-center'}>
            {topics && (
              <>
              {topics.map((topic) => {
                return (
                  <Pressable
                    className={`${getBackgroundColor(
                      topic.state
                    )} flex h-20 w-5/12 justify-center rounded-lg`}
                    key={'topic-' + topic.text}
                    onPress={() => {
                      handlePress(topic);
                    }}
                  >
                    <Text className={'text-center font-primary_medium'}>{topic.text}</Text>
                  </Pressable>
                );
              })}
              </>
            )}
            
          </SafeAreaView>
        </View>
      </ScrollView>
      <View className='justify-center self-center pt-4'>
        <Pressable
              onPress={() => {
                void handleSubmit();
              }}
              className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
            >
              <Text className={'self-center font-primary_bold text-white'}>Bevestig</Text>
            </Pressable>
      </View>
    </View>
  );
};

export default TopicSelection;
