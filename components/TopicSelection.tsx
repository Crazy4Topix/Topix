import React, { useState, useContext } from 'react';
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
  const [topics, setTopics] = useState([
    { text: 'Boek & Cultuur', value: 'boek-cultuur', state: 'neutral' },
    { text: 'Klimaat', value: 'klimaat', state: 'neutral' },
    { text: 'Economie', value: 'economie', state: 'neutral' },
    { text: 'Komedie', value: 'komedie', state: 'neutral' },
    { text: 'Educatie', value: 'educatie', state: 'neutral' },
    { text: 'Sport', value: 'sport', state: 'neutral' },
    { text: 'Politiek', value: 'politiek', state: 'neutral' },
    { text: 'Gezondheid', value: 'gezondheid', state: 'neutral' },
    { text: 'Tech', value: 'tech', state: 'neutral' },
    { text: 'Kind & Gezin', value: 'kind-gezin', state: 'neutral' },
  ]);

  const navigation = useNavigation();
  const userContext = useContext(SupabaseUserSession); // Moved useContext here

  const handlePress = (topic: Topic) => {
    setTopics((prevTopics) =>
      prevTopics.map((t) => {
        if (t.value === topic.value) {
          // Cycle through the states: neutral -> positive -> negative -> neutral
          t.state = t.state === 'neutral' ? 'positive' : t.state === 'positive' ? 'negative' : 'neutral';
        }
        console.log(t)
        return t;
      })
    );
  };

  const getBackgroundColor = (state: state): string => {
    if (state === 'neutral') {
      return 'bg-secondary';
    } else if (state === 'positive') {
      return 'bg-primary'; 
    } else if (state === 'negative') {
      return 'bg-red-400'; 
    } else {
      return 'secondary';
    }
  };

  const handleSubmit = async () => {
    const userId = userContext.session?.user.id; // Replace with the actual user ID from Supabase
    console.log(supabase)

    const topicsSelected = topics.filter((topic) => topic.state === 'positive' || topic.state === 'negative');
    const selectedTopicNames = topicsSelected
      .map((topic) => topic.value);
    const { data: topicID, error: topicError } = await supabase
      .from('topic')
      .select('id')
      .in('name', selectedTopicNames);

    if (topicError !== null) {
      console.log('error fetching topix id');
      console.log(topicError);
    }

    // Delete all rows
    const {error: delError } = await supabase
      .from('topic_preferences')
      .delete()
      .eq('user_id', userId);
    if (delError !== null){
      console.log("error deleting old topix")
      console.log(delError)
    }

    // Map each ID to an object with user_id and topic_id
    const rowsToInsert = topicID?.map((id, index) => ({
      user_id: userId,
      positive: topicsSelected[index].state === 'positive',
      topic_id: id.id,
    }));

    // Insert the rows into the 'topic_preferences' table
    const { data, error } = await supabase
      .from('topic_preferences')
      .insert(rowsToInsert)
      .select();

    if (error !== null){
      console.log("error adding new topix")
      console.log(error)
    }

    // @ts-expect-error It complains about never but it is there
    navigation.navigate(navigationDest);
  };

  return (
    <ScrollView>
    <View className={'flex w-full justify-center bg-white pt-12'}>
      <Text className={'mx-8 pb-10 text-center font-primary_medium text-2xl'}>
        <Text>Kies de</Text>
        <Text className={'font-primary_bold'}> Topix </Text>
        <Text>die jij interessant vindt{'\n'}</Text>
        <Text>Klik twee keer als je</Text>
        <Text className={'font-primary_bold'}> Topix </Text>
        <Text>niet wil zien</Text>
      </Text>
      <SafeAreaView className={'flex flex-row flex-wrap justify-center gap-2 self-center'}>
        {topics.map((topic) => {
          return (
            <Pressable
              className={`${
                getBackgroundColor(topic.state)
              } flex h-20 w-5/12 justify-center rounded-lg`}
              key={'topic-' + topic.text}
              onPress={() => {
                handlePress(topic);
              }}
            >
              <Text className={'text-center font-primary_medium'}>{topic.text}</Text>
            </Pressable>
          );
        })}
        <Pressable
          onPress={() => {
            handleSubmit();
          }}
          className={'flex h-16 w-32 justify-center rounded-md bg-accent'}
        >
          <Text className={'self-center text-white'}>Next</Text>
        </Pressable>
      </SafeAreaView>
    </View>
    </ScrollView>
  );
};

export default TopicSelection;
