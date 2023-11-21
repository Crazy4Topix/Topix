import React, { useState, useContext } from 'react';
import { Pressable, SafeAreaView, View, Text } from 'react-native';
import { useNavigation } from 'expo-router';
import { supabase } from '../lib/supabase';
import { SupabaseUserSession } from '../contexts/user_session';

const TopicSelection = () => {
  const [topics, setTopics] = useState([
    { text: 'Art', value: 'art', selected: false },
    { text: 'Books', value: 'books', selected: false },
    { text: 'Business', value: 'business', selected: false },
    { text: 'Comedy', value: 'comedy', selected: false },
    { text: 'Education', value: 'education', selected: false },
    { text: 'Games & Hobbies', value: 'games-hobbies', selected: false },
    { text: 'Government & Organizations', value: 'government-organizations', selected: false },
    { text: 'Health', value: 'health', selected: false },
    { text: 'Kids & Family', value: 'kids-family', selected: false },
    { text: 'Music', value: 'music', selected: false },
  ]);

  const navigation = useNavigation();
  const userContext = useContext(SupabaseUserSession); // Moved useContext here

  const handleSubmit = async () => {
    const userId = userContext.session?.user.id; // Replace with the actual user ID from Supabase
    console.log(supabase)

    const topicsSelected = topics.filter((topic) => topic.selected);
    console.log(topicsSelected);

    const selectedTopicNames = topicsSelected
      .filter((topic) => topic.selected)
      .map((topic) => topic.value);

    console.log(selectedTopicNames);

    const { data: topicID, error: topicError } = await supabase
      .from('topic')
      .select('id')
      .in('name', selectedTopicNames);

    console.log(topicID);

    if (topicError !== null) {
      console.log('error fetching topix id');
      console.log(topicError);
    }

    console.log(userId);
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
    const rowsToInsert = topicID?.map((id) => ({
      user_id: userId,
      positive: true,
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

    // TODO: Push topics selected to the database
    // @ts-expect-error It complains about never but it is there
    navigation.navigate('(app)');
  };

  return (
    <View className={'flex w-full justify-center bg-white pt-12'}>
      <Text className={'mx-8 pb-10 text-center font-primary_medium text-2xl'}>
        <Text>Kies de</Text>
        <Text className={'font-primary_bold'}> Topix </Text>
        <Text>die jij interessant vindt</Text>
      </Text>
      <SafeAreaView className={'flex flex-row flex-wrap justify-center gap-2 self-center'}>
        {topics.map((topic) => {
          return (
            <Pressable
              className={`${
                topic.selected ? 'bg-primary' : 'bg-secondary'
              } flex h-20 w-5/12 justify-center rounded-lg`}
              key={'topic-' + topic.text}
              onPress={() => {
                setTopics(
                  topics.map((t) => {
                    if (t.value === topic.value) {
                      t.selected = !t.selected;
                    }
                    return t;
                  })
                );
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
  );
};

export default TopicSelection;
