import React, { useState } from 'react';
import { Pressable, SafeAreaView, View, Text, Image } from 'react-native';
import LoadingBar from '../components/LoadingBar';

export default function TopicSelection() {
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

  return (
    <View className={'mt-12 flex w-full justify-center'}>
      <Text className={'mx-8 pb-10 text-center font-Poppins_500_medium text-2xl'}>
        <Text>Kies de</Text>
        <Text className={'font-Poppins_700_bold'}> Topix </Text>
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
              <Text className={'text-center font-Poppins_500_medium'}>{topic.text}</Text>
            </Pressable>
          );
        })}
      </SafeAreaView>
    </View>
  );
}
