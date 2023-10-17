import { Text, Pressable, Image, SafeAreaView, View } from 'react-native';
import { Link } from 'expo-router';

export default function Welcome() {
  return (
    <SafeAreaView className={'justify-content flex h-full w-full bg-primary-text'}>
      <View id={'background'} className={'absolute left-0 top-0 z-0 h-full w-full'}>
        <Image
          source={require('../assets/images/audio.png')}
          className={'absolute -bottom-16 -left-16 aspect-square h-56 w-52'}
        />
        <Image
          source={require('../assets/images/rss.png')}
          className={'absolute -right-16 -top-16 aspect-square h-52 w-52'}
        />
      </View>
      <View id={'foreground'} className={'z-10 overflow-visible bg-transparent px-8 pt-12'}>
        <Text className={'mt-36 px-2 font-Poppins_800_extra_bold text-4xl text-white'}>
          Welcome to
        </Text>
        <Image source={require('../assets/images/Topix_cyaan.png')} className={'h-32 w-5/6'} />
        <Text className={'mt-2 px-2 font-Poppins_800_extra_bold text-xl text-white'}>
          Daily news podcast, custom made for you
        </Text>
        <Link
          className={'self-left mt-24 flex h-16 w-10/12 justify-center'}
          href={'/signup'}
          asChild
        >
          <Pressable className={'rounded-lg bg-primary p-2'}>
            <Text className={'text-center font-Poppins_600_semi_bold text-base text-black'}>
              {' '}
              Get started
            </Text>
          </Pressable>
        </Link>
        <Link className={'flex h-16 w-10/12 justify-center self-start'} href={'/login'} asChild>
          <Pressable className={'rounded-lg p-2'}>
            <Text className={'text-left font-Poppins_600_semi_bold text-base text-white'}>
              Already have an account?
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}
