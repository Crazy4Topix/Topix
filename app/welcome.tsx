import { Text, Pressable, Image, SafeAreaView } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <SafeAreaView className={'justify-content flex h-full w-full bg-primary-text pt-12'}>
      <Image source={require('../assets/images/TopixLogo.png')} className={'h-32 w-full'} />
      <Text className={'mt-16 self-center text-xl text-white'}>Welcome to our app</Text>
      <Link className={'mt-32 self-center'} href={'/signup'} asChild>
        <Pressable className={'rounded-lg bg-accent p-2'}>
          <Text className={'text-lg text-white'}> Get started</Text>
        </Pressable>
      </Link>
      <Link className={'mt-32 self-center'} href={'/login'} asChild>
        <Pressable className={'rounded-lg bg-accent p-2'}>
          <Text className={'text-lg text-white'}> Already have an account?</Text>
        </Pressable>
      </Link>

      {/* <Link className={'mt-32 self-center'} href={'/topicSelection'} asChild>
        <Pressable className={'rounded-lg bg-accent p-2'}>
          <Text className={'text-lg text-white'}> Test</Text>
        </Pressable>
      </Link> */}

      <Link className={'mt-32 self-center'} href={'/mp3_player'} asChild>
        <Pressable className={'rounded-lg bg-accent p-2'}>
          <Text className={'text-lg text-white'}> audio</Text>
        </Pressable>
      </Link>
    </SafeAreaView>
  );
}
