import React, { useState } from 'react';
import { Pressable, SafeAreaView, View, Text } from 'react-native';

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
  ]);

  return (
    <View className={'mt-12 flex w-full justify-center'}>
      <Text className={'font-Poppins_500_medium mx-8 text-center text-2xl'}>
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
              } flex h-16 w-36 justify-center rounded-lg`}
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
              <Text className={'font-Poppins_500_medium text-center'}>{topic.text}</Text>
            </Pressable>
          );
        })}
      </SafeAreaView>
    </View>
  );
}
